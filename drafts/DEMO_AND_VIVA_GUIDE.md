# Demo and viva guide

## Recommended demo length

Record one focused video of 6 to 8 minutes. Use the prepared local OrbStack cluster with the repository's non-sensitive `e2e-demo` fixtures. Do not use a work or personal cluster.

## Recording preparation

- [ ] Use the final tagged source commit.
- [ ] Start with the local `orbstack` context and the documented fixture set.
- [ ] Close messaging, email, password managers, and unrelated browser tabs.
- [ ] Hide desktop notifications.
- [ ] Use a browser profile without personal bookmarks or saved accounts.
- [ ] Check pod logs for credentials or personal data.
- [ ] Do not reveal Kubernetes Secret values during recording.
- [ ] Record at 1920 x 1080 with readable browser zoom.
- [ ] Test microphone levels and cursor visibility.
- [ ] Prepare one controlled deployment update for the live and history sections.

## Prepared demo environment

Use the existing deterministic fixtures. They create the `e2e-demo` namespace, two log-producing pods, a Deployment, Service, ConfigMap, Secret, two Ingresses, a StatefulSet, and a DaemonSet.

```bash
orbctl start k8s
kubectl config use-context orbstack
kubectl delete -f kubeview-e2e/fixtures.yaml --ignore-not-found
kubectl apply -f kubeview-e2e/fixtures.yaml
kubectl -n e2e-demo wait --for=condition=Ready pod/e2e-logger pod/e2e-multi --timeout=180s
kubectl -n e2e-demo rollout status deployment/e2e-web --timeout=180s
kubectl -n e2e-demo rollout status statefulset/e2e-db --timeout=180s
kubectl -n e2e-demo rollout status daemonset/e2e-agent --timeout=180s
```

Start the backend with a dedicated history directory:

```bash
cd kubeview-backend
CORS_ORIGIN=http://localhost:5500 HISTORY_DIR=/tmp/kubeview-demo-history go run .
```

Start the frontend in another terminal:

```bash
cd kubeview-frontend
npm ci
npm run dev
```

Before recording, open `http://localhost:5500` and confirm that the dashboard, Pods page, pod logs, Secrets page, and Timeline page load. Keep a terminal ready with this command, but do not run it until the live-update section:

```bash
kubectl -n e2e-demo scale deployment/e2e-web --replicas=2
```

## Demo sequence

### 0:00 to 0:35, problem and value

State the problem in one sentence. Kubernetes investigation often requires several commands, while short state transitions disappear after they occur.

State the UVP. KubeView provides a read-only live dashboard and replayable cluster history without deploying a metrics or log-monitoring stack.

### 0:35 to 1:05, architecture

Show one architecture diagram. Explain the browser, Next.js frontend, Go backend, Kubernetes API, watch streams, and embedded history store. Mention read-only RBAC.

### 1:05 to 1:50, dashboard

Open the dashboard. Confirm the `orbstack` cluster identity and the pod, deployment, namespace, and node counts. State that the backend uses the selected kubeconfig context. Do not demonstrate context switching with two aliases that point to the same cluster.

### 1:50 to 3:10, resource inspection and logs

Open Pods and filter to `e2e-demo`. Open `e2e-multi`, point out its main and sidecar containers, then open Logs. Switch the container selector from `main` to `sidecar` and show that the marker changes from `E2E_MAIN_MARKER` to `E2E_SIDECAR_MARKER`. Pause the stream for several seconds, then resume it.

### 3:10 to 3:50, resource coverage and Secret handling

Briefly show ConfigMaps, Ingresses, StatefulSets, and DaemonSets. Open Secrets, filter to `e2e-demo`, and show that only key names and byte lengths appear. KubeView has no reveal control, and plaintext Secret values never reach the page.

### 3:50 to 4:50, live updates

Open Deployments and filter to `e2e-demo`. Run the prepared scale command in the terminal. Return to the browser and show `e2e-web` change from one desired replica to two without refreshing the page. Explain that the initial table comes from REST and later changes arrive through Server-Sent Events backed by Kubernetes watches.

### 4:50 to 6:00, flight recorder

Note the minute when the scale command ran. Wait at least 10 seconds, use the top timeline control to view an earlier moment, then return to LIVE. Open Timeline and set a narrow comparison window around the update. For example, if scaling ran at 16:24, compare from 16:24 to 16:25. Show the modified Deployment, added pod, and related Kubernetes events. Avoid `Last 15m` when the backend started less than 15 minutes ago because that window also includes the recorder's initial snapshot.

### 6:00 to 7:00, validation and limits

Show the GitHub Actions run with six successful jobs. Mention unit, frontend, real-cluster E2E, race, lint, vulnerability, and CodeQL checks. End with the main limitation: the backend requires an authentication layer before external exposure.

After recording, return the fixture Deployment to one replica:

```bash
kubectl -n e2e-demo scale deployment/e2e-web --replicas=1
```

## Likely viva questions

1. Why use Server-Sent Events instead of WebSockets?
2. How does KubeView recover from an expired Kubernetes watch?
3. Why retain REST endpoints after adding watches?
4. How are kubeconfig contexts isolated across requests and history?
5. How does the flight recorder reconstruct state at an earlier timestamp?
6. Why use bbolt instead of a relational or time-series database?
7. What prevents KubeView from modifying the cluster?
8. Why is read-only RBAC insufficient for public deployment?
9. How are Secret values protected in list responses?
10. What does the race detector add beyond unit tests?
11. Which tests use a real Kubernetes API server?
12. What breaks if the backend runs with multiple replicas?
13. How would the design change for a cluster with thousands of objects?
14. Which part of the system is the main technical contribution?
15. How does this differ from Kubernetes Dashboard, Lens, or Grafana?

## Manual handoff

I can prepare the final narration, command sheet, fixture manifest, and edit plan. The student must record the screen and voice unless the institution permits synthetic narration. After upload, place the final URL in `DEMO_VIDEO_LINK.txt` and verify access in a signed-out browser.
