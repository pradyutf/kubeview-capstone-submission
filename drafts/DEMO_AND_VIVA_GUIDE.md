# KubeView demo and viva guide

This runbook is for the recorded project demonstration and the live demo inside the final presentation. It uses the disposable `orbstack` Kubernetes cluster and the repository's deterministic `e2e-demo` fixtures. It does not use a work or personal cluster.

## Demo objective

The recording should prove that KubeView is a working system, not a set of screenshots. It should show a real Kubernetes API, the Go backend, the Next.js frontend, a live watch update, pod log streaming, protected Secret presentation, and historical reconstruction.

The recommended recording length is 10 to 12 minutes. This leaves enough time to explain the technical contribution without rushing through the interface.

## Feature coverage

| Area | What the recording proves |
| --- | --- |
| Cluster overview | The frontend receives live cluster identity, version, platform, and health counts from the backend. |
| Kubernetes resources | Namespaces, Pods, Deployments, Services, ConfigMaps, Secrets, Ingresses, StatefulSets, DaemonSets, Events, and Nodes are available from one interface. |
| Search and namespace scope | Resource tables can be narrowed without changing cluster state. |
| Pod diagnosis | Pod status, containers, images, conditions, labels, volumes, and restarts are visible. |
| Multi-container logs | The user can choose a container, follow its logs, pause display, and resume without losing buffered lines. |
| Live updates | A Deployment scale change appears without a page refresh through Kubernetes watches and Server-Sent Events. |
| Secret handling | Secret names, types, key names, and byte lengths are shown. Plaintext values are not sent to the page. |
| Flight recorder | A previous cluster state can be viewed and two moments can be compared. |
| Event correlation | The history comparison connects a Deployment change with the Kubernetes events produced during that change. |
| Security boundary | KubeView has no mutation controls and is designed for read-only RBAC. It still requires external authentication before network exposure. |
| Validation | The project has backend, frontend, security, and real-cluster browser checks in CI. |

## Features to explain without faking a live demonstration

- **Multiple kubeconfig contexts:** KubeView can enumerate and isolate configured contexts. This recording uses only `orbstack` because it is the one disposable cluster available. Do not create two aliases to the same cluster and present them as separate clusters.
- **Reconnect recovery:** frontend tests cover stream reconnection and a fresh REST list after reconnection. Do not deliberately break the network during the recording.
- **Recorder reconciliation:** backend tests cover dropped events, missed deletions, retention, tombstones, and context isolation. Mention this while showing the timeline.
- **Deployment methods:** the repository includes source, Docker Compose, and in-cluster Kubernetes paths. The recording uses source execution against OrbStack.
- **Read-only RBAC:** the Kubernetes manifests grant `get`, `list`, and `watch`. The local backend uses the current kubeconfig, so explain the production manifest rather than claiming the local process uses that ServiceAccount.

## Recording preparation

### Screen and audio

- [ ] Use a quiet room and a wired or stable microphone.
- [ ] Record at 1920 x 1080 when possible.
- [ ] Set browser zoom to 90 or 100 percent so full tables remain readable.
- [ ] Increase terminal font size to at least 16 points.
- [ ] Hide desktop notifications and close email, chat, password managers, and unrelated tabs.
- [ ] Use a browser window without personal bookmarks or saved-account details.
- [ ] Keep the cursor visible and move it slowly.
- [ ] Record a 20-second audio test and listen to it before the real take.
- [ ] Do not reveal kubeconfig contents, environment variables, Secret values, or unrelated Docker resources.

On macOS, press `Shift+Command+5`, select Record Entire Screen or Record Selected Portion, choose the correct microphone under Options, and click Record. Do not begin speaking immediately. Leave two seconds of silence at the start for editing.

### Required windows

Prepare these before recording:

1. Browser tab: `http://localhost:5500`
2. Browser tab: `https://github.com/varundeepsaini/kubeview/actions/runs/33142315221`
3. Terminal: repository root, ready for the scale command
4. This runbook on another screen or device when possible

Do not read the script from the same window being recorded.

### Environment preflight

The frontend and backend may already be running. Check them before restarting anything:

```bash
curl http://localhost:5501/api/health
curl -I http://localhost:5500
kubectl config current-context
kubectl -n e2e-demo get pods
kubectl -n e2e-demo get deployment e2e-web
```

Expected results:

- the health endpoint returns `"status":"ok"`;
- the frontend returns HTTP 200;
- the current context is `orbstack`;
- every `e2e-demo` pod is Running;
- `e2e-web` has one desired and one ready replica.

If `e2e-web` already has two replicas, reset it before recording:

```bash
kubectl -n e2e-demo scale deployment/e2e-web --replicas=1
kubectl -n e2e-demo rollout status deployment/e2e-web --timeout=120s
```

### Fixture setup after a clean cluster start

Use this only when the `e2e-demo` namespace is absent:

```bash
orbctl start k8s
kubectl config use-context orbstack
kubectl apply -f kubeview-e2e/fixtures.yaml
kubectl -n e2e-demo wait --for=condition=Ready pod/e2e-logger pod/e2e-multi --timeout=180s
kubectl -n e2e-demo rollout status deployment/e2e-web --timeout=180s
kubectl -n e2e-demo rollout status statefulset/e2e-db --timeout=180s
kubectl -n e2e-demo rollout status daemonset/e2e-agent --timeout=180s
```

The fixtures use BusyBox and contain no real credentials. The Secret values are dummy test data, but they should still not be shown in the video.

### History preparation

Look at the top bar in KubeView. It should show `LIVE`, `Connected`, and `history since` followed by a time.

For the easiest comparison, let the backend record the unchanged one-replica baseline for at least 16 minutes before recording. Then `Last 15m` starts after the initial snapshot and before the controlled scale operation.

Do not run the scale command during rehearsal. Running it is the main live proof in the final take.

## Exact recording script

The quoted text is a script, not text that must be memorized word for word. Speak naturally, keep the technical meaning, and do not make claims that are not visible.

### 0:00 to 0:40: introduction and UVP

**On screen**

Open `http://localhost:5500`. Click **Dashboard** in the left sidebar. Keep the cursor away from the center while speaking.

**Say**

> Hello. This is KubeView, our capstone project developed by Ankur Kalita, Pradyut Fogla, and Varun Deep Saini. Kubernetes troubleshooting often requires several commands for resources, events, and logs, and a short-lived state change may disappear before it is investigated. KubeView provides a read-only browser interface for live cluster inspection and keeps recent resource history so an operator can return to an earlier moment and compare what changed.

**Key point**

The UVP is the combination of live inspection and lightweight historical replay without requiring a full metrics or log-monitoring platform.

### 0:40 to 1:30: architecture and trust boundary

**On screen**

Remain on Dashboard. Point briefly to the context name, `Connected`, and `LIVE` indicators.

**Say**

> The browser runs a Next.js and React frontend on port 5500. It calls a Go backend on port 5501. The backend uses the official Kubernetes client libraries and the selected kubeconfig context. Ordinary resource lists begin with REST. Kubernetes watch events are then forwarded to the browser using Server-Sent Events. The flight recorder stores transformed resource versions in an embedded bbolt database with a default 72-hour retention period. KubeView does not provide create, update, or delete operations.

> This local demonstration uses the disposable OrbStack context. The application also supports multiple kubeconfig contexts, but I will not present aliases to this same cluster as separate clusters.

### 1:30 to 2:05: dashboard and cluster health

**On screen**

Move the cursor across the four summary cards. Point to the cluster line below the Dashboard heading.

**Say**

> The dashboard identifies the current cluster as OrbStack and shows the Kubernetes version and platform returned by the API. These cards summarize running Pods, healthy Deployments, active Namespaces, and ready Nodes. The values are live; I am reading the current cluster state rather than displaying hard-coded counts.

Point to **Recent Pods** and the Deployment summary.

> The lower sections give a quick operational view. From here, I can move directly into a specific resource instead of composing several kubectl commands.

Do not memorize the counts. Read the values visible in the recording because system workloads may change.

### 2:05 to 2:35: namespace search

**Actions**

1. Click **Namespaces** in the sidebar.
2. Click the search box labelled `Search namespaces...`.
3. Type `e2e-demo`.
4. Pause with the single namespace card visible.

**Say**

> Resource pages support search. This controlled namespace contains all project demo workloads, which keeps the demonstration separate from Kubernetes system resources.

Do not delete the namespace. Click **Pods** next.

### 2:35 to 3:20: pod filter and pod details

**Actions**

1. Click **Pods** in the sidebar.
2. Open the **Filter by namespace** dropdown.
3. Select `e2e-demo`.
4. Click `Search pods...` and type `e2e-multi`.
5. Confirm that only `e2e-multi` remains and that its Ready column shows `2/2`.
6. Click the blue `e2e-multi` pod name.

**Expected screen**

- Pod status: Running
- Containers: `main` and `sidecar`, both marked Running
- Image: `busybox:1.36`
- Conditions table
- Projected Kubernetes API volume
- Label `app: e2e-multi`

**Say**

> I have scoped the request to the demo namespace and then searched for a two-container Pod. The detail view combines status, node and IP information, container names and images, restart counts, Kubernetes conditions, volumes, and labels. This is the information commonly needed before opening logs.

Scroll only enough to show Conditions, Volumes, and Labels, then return to the top of the pod page.

### 3:20 to 4:35: multi-container live logs

**Actions**

1. Click the **Logs** button beside Overview.
2. Wait until `E2E_MAIN_MARKER` lines are visible.
3. Open the **Container** dropdown.
4. Select `sidecar`.
5. Wait until `E2E_SIDECAR_MARKER` lines are visible.
6. Click **Pause**.
7. Keep the page still for three seconds.
8. Click **Resume**.
9. Show that buffered lines appear and the stream continues.

**Say**

> Log requests are container-aware. The default selection is the main container, whose stream contains the main marker. When I select the sidecar, the backend starts a stream for that exact container and the output changes to the sidecar marker.

> Pause stops the visible log movement without discarding lines already arriving. Resume flushes the buffered lines and continues following the stream. The backend also limits tail size and scanner line size so one request cannot grow without bounds.

### 4:35 to 5:55: Kubernetes resource coverage

This section is deliberately quick. Show that the pages work and explain what each adds. Do not read every column.

#### Deployments

1. Click **Deployments**.
2. Type `e2e-web` into `Search deployments...`.

**Say**

> The Deployment view shows desired and ready replicas, update status, availability, rollout strategy, and container images. The demo Deployment currently has one ready replica. I will return here for the live update.

#### Services

1. Click **Services**.
2. Type `e2e-svc` into `Search services...`.

**Say**

> The Service view exposes type, cluster address, external address when present, and the port mapping. This fixture is a ClusterIP Service on port 80.

#### ConfigMaps

1. Click **ConfigMaps**.
2. Type `e2e-config` into `Search configmaps...`.

**Say**

> ConfigMaps are summarized by namespace and data keys. KubeView shows `greeting` and `log-level` without turning the page into a configuration editor.

#### Ingresses

1. Click **Ingresses**.
2. Type `e2e-ing-paths` into `Search ingresses...`.

**Say**

> The Ingress view connects the host and path to the backend Service and port. Here `e2e.example.com` routes its root path to `e2e-svc` on port 80.

#### StatefulSets and DaemonSets

1. Click **StatefulSets** and point to `e2e-db` with `1/1` ready and service `e2e-db-hl`.
2. Click **DaemonSets** and point to `e2e-agent` with desired, current, ready, updated, and available counts all equal to one.

**Say**

> KubeView also covers stateful and node-wide workloads. The StatefulSet page shows replica state and its governing Service. The DaemonSet page shows scheduling and readiness across nodes.

Nodes are already represented on the dashboard. Do not open every page merely to increase the video length.

### 5:55 to 6:35: Secret protection

**Actions**

1. Click **Secrets**.
2. Type `e2e-secret` into `Search secrets...`.
3. Point to type `Opaque`.
4. Point to `password (15 bytes)` and `username (8 bytes)`.

**Say**

> Secret read access is sensitive even in a read-only application. The list response contains the Secret name, type, key names, and byte lengths. It does not send the plaintext values to the page, and there is no reveal control. The production ServiceAccount can also omit Secret access when this view is not required.

Never run `kubectl get secret -o yaml` during the recording.

### 6:35 to 7:55: live Deployment update

**Browser preparation**

1. Click **Deployments**.
2. Type `e2e-web` into `Search deployments...`.
3. Point to the current `1/1` replica state.
4. Do not refresh the page after this point.

**Say before switching to the terminal**

> KubeView is an observer, so I will mutate the cluster with kubectl rather than through the dashboard. The open table currently shows one desired and one ready replica. I will scale the Deployment to two replicas and leave this page open to prove that the update arrives live.

**Terminal action**

Switch to the prepared terminal and run:

```bash
date '+Scale started: %Y-%m-%d %H:%M:%S'
kubectl -n e2e-demo scale deployment/e2e-web --replicas=2
```

Read or remember the printed minute. Return immediately to the browser. Do not press Refresh.

**Expected screen**

The `e2e-web` row may briefly show `1/2`, then should settle at `2/2` with two ready, updated, and available replicas.

**Say**

> The row changed without a page reload. The frontend first obtains a bounded REST snapshot, then receives add and modify events over Server-Sent Events. The backend sources those events from Kubernetes watches. On reconnection, the frontend performs another list request so it can recover changes missed while disconnected.

If the row remains at `1/2`, wait for the second Pod to become Ready. Do not rerun the scale command.

### 7:55 to 8:35: Kubernetes events

**Actions**

1. Click **Events**.
2. Select `e2e-demo` from **Filter by namespace**.
3. Type `e2e-web` into `Search events...`.
4. Point to `ScalingReplicaSet` and `SuccessfulCreate`.

**Say**

> The Events page makes Kubernetes control-plane activity searchable. The scale operation produced a Deployment scaling event, a ReplicaSet creation event, Pod scheduling, image, container creation, and start events. Filtering by namespace and object keeps the diagnosis focused.

Ignore unrelated system events. The namespace and search filters should leave only the controlled demo activity.

### 8:35 to 9:30: view the earlier state

Wait at least 12 seconds after the scale operation before using the top timeline control.

**Actions**

1. Return to **Deployments**.
2. Search for `e2e-web` again.
3. Confirm the live state is `2/2`.
4. In the top bar, drag the timeline slider left to a time before the scale command.
5. Stop when the page displays `Viewing past` and the Deployment shows `1/1`.
6. Point to the historical timestamp.
7. Click **LIVE** to return to `2/2`.

**Say**

> The global timeline changes the data source for resource pages. In past mode, the frontend does not mix live watch events into the reconstructed snapshot. The backend selects the latest stored version of each object at or before this timestamp and applies deletion tombstones where necessary. Returning to LIVE restores the current cluster state.

If the historical page still shows `2/2`, drag farther left. Do not claim a result until `1/1` is visible.

### 9:30 to 10:35: compare two moments

**Preferred path when history is older than 15 minutes**

1. Click **Timeline** in the sidebar or **Compare** in the top bar.
2. Click **Last 15m**.
3. Point to the summary counts.
4. Find the `deployments / e2e-demo/e2e-web` modified row.
5. Point to the replica summary such as `desiredReplicas: 1 -> 2` and `readyReplicas: 1 -> 2`.
6. Point to the added Pod row.
7. Scroll to the related event feed.

**Fallback when the initial snapshot appears as many added resources**

Use the minute printed by the terminal command:

1. Set **From** to the scale-command minute.
2. Set **To** to the following minute.
3. Click **Compare**.

For example, a command at 16:24:21 uses From `16:24` and To `16:25`.

**Say**

> The comparison endpoint reconstructs both endpoint states and compares resources by identity. It reports the new replica Pod as added and `e2e-web` as modified. The field summary records the replica transition, while the event feed explains why the state changed. This connects state history with Kubernetes activity instead of presenting an unexplained snapshot.

Do not say that KubeView stores metrics or complete logs. It stores transformed resource versions and events. Pod logs are streamed but are not written into the history database.

### 10:35 to 11:25: validation evidence

**Actions**

1. Switch to the prepared GitHub Actions tab.
2. Show run `33142315221` and its successful jobs.
3. Keep repository or account details that are not part of this project out of view.

**Say**

> This source baseline was validated in GitHub Actions. The repository contains 227 Go test functions, 60 frontend Vitest cases, and 45 Playwright cases. The retained run completed backend tests with the race detector, backend static and vulnerability checks, frontend type checking, lint, tests and production build, CodeQL for Go and JavaScript or TypeScript, and Playwright against a real Kubernetes cluster.

> These results prove that the defined checks passed for the named commit. They do not prove the absence of every defect, and the final report records the remaining accessibility, performance, and clean-installation validation work separately.

### 11:25 to 12:00: limitations and close

Return to the KubeView dashboard.

**Say**

> KubeView is intentionally read-only and focused on inspection. It is not a replacement for metrics, alerting, distributed tracing, or long-term log storage. The current backend does not authenticate individual browser users, so it must remain behind a protected access path or authentication proxy. The embedded history store also assumes one backend writer. These limits are documented rather than hidden.

> The main result is a working Kubernetes inspection tool that combines current resources, live changes, container logs, context-aware access, and recent historical comparison in one browser workflow. Thank you.

Stop speaking, wait two seconds, then stop the recording.

## What not to claim

- Do not say the backend authenticates users. It does not.
- Do not say read-only access makes cluster data public-safe. Logs and Secret metadata remain sensitive.
- Do not say CORS is authorization.
- Do not say the flight recorder stores metrics, traces, or complete pod logs.
- Do not describe two aliases to one Kubernetes cluster as multi-cluster proof.
- Do not call source test counts coverage percentages.
- Do not claim performance, accessibility, or clean-install results until those checks have evidence.
- Do not claim the local process uses the in-cluster ServiceAccount. The local demonstration uses kubeconfig credentials.

## Recovery during recording

### Dashboard remains on Connecting

Check the backend:

```bash
curl http://localhost:5501/api/health
```

If it fails, stop the take and restart the backend. Do not troubleshoot on camera.

### Frontend shows Failed to fetch

Confirm the backend is on port 5501 and the frontend is on port 5500. A backend started without `CORS_ORIGIN=http://localhost:5500` may reject browser access.

### Demo resources are missing

Run:

```bash
kubectl -n e2e-demo get pods
kubectl apply -f kubeview-e2e/fixtures.yaml
```

Wait until all fixtures are Ready, then begin a new take.

### Pod logs are blank

Wait five seconds. Then confirm the source directly:

```bash
kubectl -n e2e-demo logs e2e-multi -c main --tail=5
kubectl -n e2e-demo logs e2e-multi -c sidecar --tail=5
```

### Deployment starts at two replicas

Reset it to one and wait for the rollout before starting a new take:

```bash
kubectl -n e2e-demo scale deployment/e2e-web --replicas=1
kubectl -n e2e-demo rollout status deployment/e2e-web --timeout=120s
```

### Timeline reports many added resources

The comparison begins before the recorder's initial snapshot. Use the one-minute window around the scale command instead of `Last 15m`.

### Timeline does not show the replica change

Confirm the comparison starts before the scale command and ends after the Deployment reached `2/2`. Increase the To value by one minute if necessary.

### Events contain unrelated system warnings

Select namespace `e2e-demo` and search for `e2e-web`. Do not explain unrelated local-machine events.

## After recording

Return the fixture to its baseline:

```bash
kubectl -n e2e-demo scale deployment/e2e-web --replicas=1
kubectl -n e2e-demo rollout status deployment/e2e-web --timeout=120s
```

Review the full video before uploading:

- [ ] Voice is clear and synchronized.
- [ ] All on-screen text is readable at normal playback size.
- [ ] No notifications, credentials, Secret values, or unrelated project names are visible.
- [ ] The scale change visibly moves from `1/1` to `2/2` without a refresh.
- [ ] Past mode visibly returns the Deployment to `1/1`.
- [ ] The Timeline comparison contains the modified Deployment and related events.
- [ ] The CI run and source commit are identifiable.
- [ ] Claims match the visible evidence.
- [ ] The file plays from beginning to end after upload.
- [ ] The shared link opens in a signed-out or incognito browser.

Place the verified URL in the report, project summary, presentation, and final submission link file.

## Likely viva questions and answer points

### Why use Server-Sent Events instead of WebSockets?

The live resource flow is server-to-browser. SSE uses ordinary HTTP, has browser reconnection support, and is simpler than a bidirectional protocol for this use case. Pod logs also fit a one-way stream.

### Why retain REST endpoints after adding watches?

A watch reports changes after a starting point. The frontend still needs an authoritative initial list. It also repeats the list after reconnecting so missed events do not leave stale state.

### How does KubeView recover from an expired watch?

The stream ends when the Kubernetes watch closes or errors. The browser reconnects, fetches a fresh list, and opens another stream.

### How are contexts isolated?

The backend validates requested context names against the loaded kubeconfig, creates context-specific clients, and includes the context in history keys and requests. An unknown context receives a client error.

### How does the flight recorder reconstruct an earlier state?

It stores versioned transformed objects. For a requested timestamp, it selects the latest version at or before that moment for each object. A deletion tombstone removes objects that no longer existed.

### Why use bbolt?

The project needs an embedded, local, ordered key-value store with one writer and no separate database service. bbolt matches that scope. It is not suitable for horizontally replicated writers, which is documented as a limitation.

### What prevents mutation?

The application exposes inspection routes only. The supplied in-cluster RBAC grants `get`, `list`, and `watch`, without create, update, patch, or delete verbs.

### Why is read-only RBAC insufficient for public deployment?

Read access can still expose workload metadata, logs, configuration names, and Secret information. The backend does not identify individual users, so an authentication and authorization layer is required before shared exposure.

### How are Secret values protected?

The transformer returns key names and byte lengths rather than the data values. The frontend has no reveal control. Operators can remove Secret permission entirely when the view is unnecessary.

### What does the race detector add?

It detects data races reached during Go tests. This matters because the backend runs concurrent HTTP requests, streams, watches, and history writes. A pass does not prove that every concurrency path was exercised.

### Which tests use a real Kubernetes API server?

The Playwright E2E job starts a real local Kubernetes cluster, applies deterministic fixtures, starts the real Go and Next.js applications, and drives Chromium through user workflows.

### What happens with multiple backend replicas?

Live reads can be replicated, but the embedded history store is local to one process and assumes one writer. Shared historical state would require external or replicated storage plus coordination.

### How would the design change for thousands of objects?

Measure list latency, watch rate, memory, queue pressure, and database growth first. Likely changes include pagination or virtualization in the UI, tighter retention, resource selection, backpressure metrics, and shared storage for multiple backend instances.

### What is the main technical contribution?

The strongest contribution is the integration of live Kubernetes watches with a bounded historical recorder and browser-level time travel, while preserving context isolation and a read-only operational model.

### How is this different from Kubernetes Dashboard, Lens, or Grafana?

KubeView is narrower. It focuses on browser-based resource inspection, live changes, logs, and short historical replay. It does not attempt cluster administration or full observability.
