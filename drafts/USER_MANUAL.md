# KubeView user manual

Version: submission draft for commit `8ee601c`

## What KubeView does

KubeView is a read-only browser interface for Kubernetes. It displays current cluster resources, streams changes and pod logs, switches between kubeconfig contexts, and records a bounded history that can reconstruct earlier cluster state.

KubeView does not create, edit, scale, restart, or delete Kubernetes objects.

## Starting a session

1. Confirm that the backend and frontend are running.
2. Open `http://localhost:5500` unless the operator supplied another URL.
3. Check the connection indicator in the sidebar.
4. If more than one kubeconfig context is available, select the required context from the Context control.
5. Confirm the cluster name and Kubernetes version on the dashboard before investigating resources.

The selected context persists in the browser. Changing context reloads requests, live streams, and history for the new cluster.

## Dashboard

The dashboard summarizes running pods, healthy deployments, namespaces, and ready nodes. Select a summary to open its resource page. Counts update from Kubernetes watch events rather than repeated full-list requests.

## Resource pages

The sidebar provides pages for Namespaces, Pods, Deployments, Services, ConfigMaps, Secrets, Ingresses, StatefulSets, DaemonSets, Events, Nodes, and Timeline.

Namespaced pages provide a namespace selector and text search. Search is applied to the currently loaded data. A context switch changes the cluster for the entire application.

## Inspecting pods

Open Pods and select a pod name. The detail page shows status, node, pod IP, containers, conditions, volumes, images, restart counts, and container types.

KubeView distinguishes regular containers, init containers, restartable init sidecars, and ephemeral containers. For a multi-container pod, select the required container before reading logs.

## Following pod logs

1. Open a pod.
2. Select Logs.
3. Choose a container when the pod contains more than one.
4. Use Pause to stop the live connection.
5. Use Resume to start a new live stream.

The backend requests a bounded initial tail and then follows new output. Log content can contain credentials, personal data, or application secrets. Do not share screenshots or recordings without checking the visible output.

## Viewing Secrets

The Secrets page initially displays each Secret's metadata, key names, and value lengths. It does not include values in the list response.

Select Reveal only when access to the value is required. Reveal triggers a separate backend request and places the value in the browser. Use Hide after inspection. Do not reveal Secret values during a public demo or screen recording.

## Live updates

Resource pages load an initial REST snapshot and then subscribe to Server-Sent Events. Added, modified, and deleted resources update their rows in place. The browser reconnects after a broken stream, while REST remains available for recovery.

If data appears stale:

1. confirm that the backend is reachable;
2. check that the selected context is valid;
3. reload the browser page;
4. ask the operator to verify Kubernetes API connectivity and RBAC.

## Using historical state

When history recording is enabled, a timeline bar appears above the main content.

1. Drag the slider to an earlier timestamp.
2. Release it to load the reconstructed cluster state.
3. Confirm the amber past-state indicator before interpreting results.
4. Select LIVE to return to current state.

History is stored per Kubernetes context. The default retention is 72 hours. The oldest visible timestamp depends on when the backend started recording and whether the configured storage persisted across restarts.

## Comparing two moments

Open Timeline and choose From and To timestamps. Select Compare, or use a preset such as Last 15m, Last hour, or Last 6h.

The result lists added, removed, and modified resources. Modified entries can report image, restart, replica, or condition changes. Kubernetes events from the selected period appear below the changes.

The comparison describes recorded API state. It is not a replacement for metrics, traces, audit logs, or application logs.

## Common problems

### The interface reports Failed to fetch

Confirm that the backend URL is correct, the backend process is running, and its `CORS_ORIGIN` includes the frontend origin.

### A context is unavailable

Run `kubectl config get-contexts` on the backend host. Confirm that the context exists and its cluster is reachable. The backend must restart after kubeconfig context definitions change.

### A page is empty

Check the namespace filter, search field, and selected context. Confirm the resource exists with `kubectl get` using the same context and namespace.

### History controls do not appear

History is hidden when recording is disabled or no usable range exists. Check `HISTORY_RETENTION_HOURS` and backend logs.

### Log streaming stops

The pod may have terminated, the container may have changed, or the connection may have closed. Resume the stream or reload the pod page.

## Safe use

- Treat pod logs and revealed Secret values as sensitive.
- Do not expose the backend directly to an untrusted network.
- Put authentication in front of any externally reachable deployment.
- Use the supplied read-only RBAC instead of cluster-admin.
- Keep the history database on protected storage because it records cluster state.
- Return to LIVE before making operational decisions based on the interface.

