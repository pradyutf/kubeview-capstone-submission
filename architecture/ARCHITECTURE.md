# KubeView architecture diagrams

Evidence baseline: source commit `8ee601c`.

These diagrams are original documentation derived from the source. Mermaid is the editable source. Export each diagram to SVG or PNG only after the official report and presentation templates arrive.

## System context

```mermaid
flowchart LR
    user[Developer or cluster operator]
    browser[Web browser]
    frontend[KubeView frontend<br/>Next.js and React]
    backend[KubeView backend<br/>Go net/http]
    kubeconfig[Kubeconfig or<br/>in-cluster configuration]
    api[Kubernetes API server]
    history[(Local bbolt<br/>history database)]

    user -->|Inspects resources and history| browser
    browser -->|Loads application| frontend
    browser -->|REST, SSE and log requests| backend
    backend -->|Selects an allowed context| kubeconfig
    backend -->|get, list and watch| api
    backend -->|Version records and queries| history
```

The browser calls the backend directly. The frontend does not receive a Kubernetes service-account token and does not communicate with the Kubernetes API. The backend is therefore the main trust boundary.

## Live resource update flow

```mermaid
sequenceDiagram
    actor User
    participant UI as React resource page
    participant API as Go backend
    participant K8s as Kubernetes API

    User->>UI: Opens a resource page
    UI->>API: GET resource list with context and namespace
    API->>K8s: List resource objects
    K8s-->>API: Snapshot
    API-->>UI: Transformed JSON list
    UI->>API: EventSource GET /api/watch
    API->>K8s: Open watch for subscribed resource kinds
    K8s-->>API: ADDED, MODIFIED or DELETED event
    API-->>UI: SSE resource event
    UI->>UI: Reconcile event by namespace and name
    API-->>UI: SSE heartbeat every 30 seconds

    Note over UI,API: On reconnect, the UI re-lists after the stream opens<br/>and replays events buffered during the list request.
```

The frontend multiplexes resource subscriptions into one `EventSource` per namespace filter. This avoids exhausting the small per-origin connection limit used by some browsers. A replacement or failed stream triggers a list refresh after reconnection so the table converges even if events were missed.

## Multi-context isolation

```mermaid
flowchart TB
    selector[Context selector]
    apiState[Frontend API context state]
    timeState[Time-travel pin]
    manager[ClientManager]
    cache[Lazy client cache]
    clientA[Timed and streaming clients<br/>context A]
    clientB[Timed and streaming clients<br/>context B]
    clusterA[Kubernetes cluster A]
    clusterB[Kubernetes cluster B]
    bucketA[(History bucket<br/>context A)]
    bucketB[(History bucket<br/>context B)]

    selector --> apiState
    selector -->|Resets historical pin| timeState
    apiState -->|context query parameter| manager
    manager -->|Validate configured name| cache
    cache --> clientA
    cache --> clientB
    clientA --> clusterA
    clientB --> clusterB
    clientA --> bucketA
    clientB --> bucketB
```

`ClientManager` accepts only context names loaded from kubeconfig. It creates clients lazily and caches each context separately. Every list, watch, log, and history request resolves the context before running its handler. The history store uses a top-level bucket per context. The frontend clears a pinned historical timestamp when the selected context changes, preventing a timestamp chosen for one cluster from being reused against another.

## Flight-recorder write and recovery path

```mermaid
flowchart LR
    informers[Shared informers<br/>one set per active context]
    transform[Resource transformers]
    queue[Bounded write queue]
    writer[Batch writer]
    buckets[(bbolt context and<br/>resource buckets)]
    reconcile[Periodic reconciliation]
    prune[Retention sweeper]

    informers -->|Add, update, delete| transform
    transform --> queue
    queue --> writer
    writer -->|Skip unchanged body and age-only changes| buckets
    informers -->|Current cache contents| reconcile
    buckets -->|Previously live keys| reconcile
    reconcile -->|Heal dropped events and tombstone absences| queue
    prune -->|Delete expired versions while retaining a baseline| buckets
```

The default context starts recording during backend startup. Other contexts start on first use. Informer callbacks never block on storage. If the bounded queue is full, a record can be dropped, but reconciliation later compares informer caches with stored live objects and repairs the gap. The writer stores changed versions and deletion tombstones. Version keys combine the object key with a fixed-width timestamp, which supports state reconstruction at a requested moment. Retention defaults to 72 hours.

## Historical read path

```mermaid
sequenceDiagram
    actor User
    participant Timeline as Timeline UI
    participant API as History API
    participant Store as bbolt store

    User->>Timeline: Selects a past moment
    Timeline->>API: GET /api/history/state?at=timestamp
    API->>Store: Read newest version of each object at or before timestamp
    Store-->>API: Reconstructed objects and tombstones
    API-->>Timeline: Resource state with age recalculated for that moment
    User->>Timeline: Selects comparison window
    Timeline->>API: GET /api/history/diff?from=...&to=...
    API->>Store: Reconstruct both states and read events in window
    Store-->>API: Before state, after state and events
    API-->>Timeline: Added, removed and modified objects with summaries
```

The state endpoint returns the last recorded version at or before the selected time and applies deletion tombstones. The diff endpoint compares two reconstructed maps and includes Kubernetes events from the selected interval. Volatile display fields such as age do not create false changes.

## In-cluster deployment and trust boundaries

```mermaid
flowchart LR
    user[Authorized user]
    access[Port forward, authenticated<br/>proxy or protected ingress]

    subgraph ns[KubeView namespace]
        frontend[Frontend pod<br/>no service-account token]
        backend[Backend pod<br/>non-root, read-only root filesystem]
        volume[(History volume)]
        policy[NetworkPolicy]
        serviceAccount[ServiceAccount]
    end

    api[Kubernetes API server]
    role[Read-only ClusterRole<br/>get, list and watch]

    user --> access --> frontend
    frontend -->|HTTP requests| backend
    policy -. restricts backend ingress .-> backend
    backend --> volume
    backend --> serviceAccount
    serviceAccount --> role --> api
```

The manifests run both containers as non-root users, drop Linux capabilities, and use read-only root filesystems. The frontend does not mount a service-account token. The backend service account can read only the resource types shown by the application, including pod logs and Secrets. The backend has no user authentication, so the deployment still needs a protected access path. NetworkPolicy limits ordinary pod-network ingress to the frontend but does not authenticate the person using the application.

## Design decisions and limits

| Decision | Reason | Cost or limit |
| --- | --- | --- |
| REST snapshot followed by SSE | A list gives a complete initial state; watch events avoid repeated full-list polling. | Reconnection requires a fresh list to cover missed events. |
| One `EventSource` per namespace | Keeps browser connection use bounded while several pages subscribe to resources. | Changing the subscribed set reopens the stream. |
| Separate timed and streaming Kubernetes clients | A 55-second timeout bounds list and detail requests without terminating watches or followed logs. | Each context holds two clientsets after first use. |
| Lazy per-context client cache | Unused kubeconfig contexts do not create clients. | A context can be configured but unreachable until its first request. |
| Local bbolt history | Adds historical reconstruction without an external database. | One writable backend instance owns the file; horizontal replication is unsupported. |
| Bounded, non-blocking recorder queue | Kubernetes informer handlers do not wait for disk writes. | Bursts can drop records until reconciliation repairs current state. |
| Read-only Kubernetes RBAC | The application cannot create, update, or delete workloads. | Read access to logs and Secret values still carries confidentiality risk. |
| Best-effort history startup | A history-path failure does not take down live inspection. | Operators must notice logs or the disabled history response. |

