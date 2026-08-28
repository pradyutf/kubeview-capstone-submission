# KubeView installation guide

Version: submission draft for commit `8ee601c`

## Supported installation paths

KubeView can run directly from source, through Docker Compose, or inside Kubernetes. Use one path. The local source path is best for development, Docker Compose is convenient for a demonstration, and the Kubernetes manifests show the in-cluster deployment model.

## Prerequisites

- Git
- A reachable Kubernetes cluster
- `kubectl` configured for that cluster
- Go 1.26.6 or a compatible Go 1.26 release for source installation
- Node.js 24 for the frontend CI-compatible setup
- Docker for container installation
- `kind` only when creating the documented local test cluster

Verify cluster access before installing KubeView:

```bash
kubectl cluster-info
kubectl get nodes
kubectl config get-contexts
```

Do not continue until those commands work for the intended context.

## Get the source

```bash
git clone https://github.com/varundeepsaini/kubeview.git
cd kubeview
git checkout 8ee601c
```

The final submission will replace the commit above with `[PLACEHOLDER: release tag or final commit]`.

## Run from source

Start the backend:

```bash
cd kubeview-backend
go mod download
go run .
```

The default API URL is `http://localhost:5501`. Verify it in another terminal:

```bash
curl http://localhost:5501/api/health
```

Start the frontend from another terminal:

```bash
cd kubeview-frontend
npm ci
npm run dev
```

Open `http://localhost:5500`.

## Run with Docker Compose

From the repository root:

```bash
docker compose up --build
```

The Compose configuration mounts the host kubeconfig read-only and starts both services. Docker Desktop users may need host networking enabled when the Kubernetes API uses a loopback address.

To use another kubeconfig file:

```bash
KUBECONFIG_HOST=/absolute/path/to/config docker compose up --build
```

On Linux, set the container user when the kubeconfig is not readable by UID 1000:

```bash
UID=$(id -u) GID=$(id -g) docker compose up --build
```

Stop the stack with `Ctrl+C`, then run `docker compose down`.

## Deploy inside Kubernetes

Build the images:

```bash
docker build -t kubeview-backend:latest kubeview-backend/
docker build -t kubeview-frontend:latest kubeview-frontend/
```

For a local `kind` cluster:

```bash
kind load docker-image kubeview-backend:latest kubeview-frontend:latest
kubectl apply -k deploy/kubernetes/
kubectl -n kubeview rollout status deployment/kubeview-backend
kubectl -n kubeview rollout status deployment/kubeview-frontend
```

Expose both services locally:

```bash
kubectl -n kubeview port-forward svc/kubeview-backend 5501:5501
kubectl -n kubeview port-forward svc/kubeview-frontend 5500:5500
```

Run the port-forward commands in separate terminals. Open `http://localhost:5500`.

The frontend API address is compiled into its browser bundle. For a non-local deployment, build the frontend image with an address that the user's browser can reach:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_BASE=https://kubeview-api.example.com/api \
  -t kubeview-frontend:1.0.0 kubeview-frontend/
```

Set backend `CORS_ORIGIN` to the exact frontend origin.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `5501` | Backend listening port |
| `KUBECONFIG` | `~/.kube/config` | Kubeconfig path list using the platform separator |
| `CORS_ORIGIN` | `http://localhost:5500` | Comma-separated allowed frontend origins |
| `HISTORY_RETENTION_HOURS` | `72` | Retained history duration; zero disables recording |
| `HISTORY_DIR` | User cache directory | Directory containing `history.db` |
| `NEXT_PUBLIC_API_BASE` | `http://localhost:5501/api` | Backend URL compiled into the frontend |

## Installation validation

Check the API:

```bash
curl http://localhost:5501/api/health
curl http://localhost:5501/api/contexts
curl http://localhost:5501/api/namespaces
```

Check deployment permissions:

```bash
kubectl auth can-i list pods \
  --as=system:serviceaccount:kubeview:kubeview
kubectl auth can-i delete pods \
  --as=system:serviceaccount:kubeview:kubeview
```

The list check should return `yes`. The delete check should return `no`.

## Removal

For the in-cluster deployment, run `kubectl delete -k deploy/kubernetes/`.

Delete the configured history directory separately only when its recorded data is no longer required.

## Security notes

The backend has no built-in user login. It can return pod logs and explicitly revealed Secret values. Do not publish the backend Service without an authentication proxy and network controls. The supplied manifests use read-only RBAC and a NetworkPolicy; preserve both controls.

