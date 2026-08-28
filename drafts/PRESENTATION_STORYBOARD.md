# KubeView final presentation storyboard

Status: content-ready draft for the official BITS template  
Evidence baseline: commit `8ee601c`  
Target duration: 10 to 12 minutes plus questions

## Communication job

By the end, the viva panel should understand the problem KubeView solves, the engineering decisions behind live and historical state, the evidence supporting the implementation, and the limits that remain.

## Slide 1. Title

### Visible copy

`[PLACEHOLDER: official project title]`

Read-only live and historical Kubernetes inspection

`[PLACEHOLDER: student name and BITS ID]`  
`[PLACEHOLDER: supervisor name]`  
`[PLACEHOLDER: programme, semester and date]`

### Visual

Use one clear product screenshot, preferably `screenshots/01-dashboard.png`, as a large background or right-side crop according to the BITS template. Do not add architecture or metrics to the title slide.

### Speaker note

KubeView combines browser-based cluster inspection, live changes, pod logs, multi-cluster selection, and a recent replayable history. It remains read-only and does not try to replace production monitoring.

## Slide 2. Current state is easy to inspect, past state is not

### Visible copy

- Kubernetes diagnosis spans resource lists, details, events, logs, and contexts.
- Command-line output usually captures only the moment when the command ran.
- Full monitoring stacks solve a larger problem and carry their own deployment and storage cost.

Bottom line: short failures can disappear before an investigation starts.

### Visual

A simple sequence: live cluster change, failure clears, user begins investigation. Use three labelled points on one line, not a card grid.

### Speaker note

The project focuses on the gap between direct `kubectl` inspection and a full telemetry platform. The problem is not that existing tools fail. Their scope differs.

### Sources

Kubernetes API concepts and Prometheus overview, report references [2] and [4].

## Slide 3. The project combines live inspection with a bounded replay window

### Visible copy

KubeView gives a developer a read-only live view and a 72-hour replayable history of multiple Kubernetes clusters without requiring a metrics or log-monitoring stack.

Four proof points:

- Kubernetes watches feed live resource changes.
- A local flight recorder stores changed object versions.
- One interface switches between kubeconfig contexts.
- RBAC grants read verbs only.

### Visual

Place the UVP as the dominant text. Use four small supporting icons only if the BITS template has room.

### Speaker note

The 72-hour value is the default and is configurable. The product records Kubernetes object state and events, not metrics or arbitrary log history.

## Slide 4. The browser never receives Kubernetes credentials

### Visible copy

Browser and Next.js UI -> Go API -> Kubernetes API

The Go backend selects the context, transforms resource objects, streams changes, and owns the history database.

### Visual

Export the system-context diagram from `submission/architecture/ARCHITECTURE.md`. Keep the browser, frontend, backend, API server, kubeconfig, and bbolt store visible.

### Speaker note

The browser calls the backend for REST, SSE, and logs. The frontend pod has no service-account token. The backend is the main trust boundary because it holds the cluster identity.

## Slide 5. A snapshot and a watch solve different consistency problems

### Visible copy

1. List the current resource state.
2. Open one multiplexed SSE stream per namespace.
3. Apply add, modify, and delete events.
4. Re-list after reconnect and replay events buffered during the request.

### Visual

Use the live resource update sequence from `submission/architecture/ARCHITECTURE.md`. Emphasize the initial list, watch stream, and reconnect refresh.

### Speaker note

Opening a stream alone is insufficient because events can be missed during disconnection. A list alone is stale immediately. KubeView combines them and protects against the race where an event arrives while a list request is in flight.

### Sources

Kubernetes API concepts and MDN Server-Sent Events, report references [2] and [7].

## Slide 6. Context selection is enforced across every data path

### Visible copy

- `ClientManager` accepts only contexts loaded from kubeconfig.
- Each context has separate timed and streaming clients.
- Lists, logs, watches, and history use the resolved context.
- Switching clusters clears a historical timestamp from the previous cluster.

### Visual

Export the multi-context isolation diagram. Give context A and context B distinct restrained colors. Show separate cluster and history destinations.

### Speaker note

Context is not a UI label. It changes credentials and API server. The shared backend wrapper resolves it before each handler, and the database uses a top-level bucket per context.

## Slide 7. The recorder stores deltas and repairs recoverable gaps

### Visible copy

Shared informers -> bounded queue -> batched bbolt writes

- Unchanged and age-only versions are skipped.
- Deletions become tombstones.
- Reconciliation repairs dropped current-state records.
- Pruning retains a baseline for state reconstruction.

### Visual

Export the flight-recorder write and recovery diagram. Keep the write path horizontal and the reconciliation loop clearly separate.

### Speaker note

Informer callbacks never wait for disk. A full queue can lose an intermediate version, but later reconciliation restores current state. The design makes a precise trade-off: it protects live API processing without claiming a complete audit log.

### Sources

client-go and bbolt, report references [5] and [8].

## Slide 8. Time travel reconstructs state, not screenshots

### Visible copy

- Select a timestamp to view resource state at that moment.
- Compare two moments to find added, removed, and modified objects.
- Link object differences with Kubernetes events from the same interval.
- Recalculate age relative to the viewed moment.

### Visual

Use an updated screenshot of the timeline page. Until one is captured, use `[PLACEHOLDER: timeline and diff screenshot from final build]`.

### Speaker note

The store reads the latest version of each object at or before the chosen time and applies deletion markers. Diff summaries ignore volatile display age and are capped to keep the interface readable.

## Slide 9. Read-only design reduces impact but does not provide user security

### Visible copy

Existing controls:

- `get`, `list`, and `watch` RBAC only
- exact CORS allow-list
- non-root containers and dropped capabilities
- read-only root filesystems
- backend ingress restricted to the frontend pod

Main residual risk: the backend has no user authentication and can expose logs or Secret values.

### Visual

Use the in-cluster trust-boundary diagram. Highlight the protected access path outside the application.

### Speaker note

CORS and NetworkPolicy are not substitutes for identity. Public or shared deployment requires an authenticated proxy or protected ingress. Secret access can also be removed from the role when it is unnecessary.

### Sources

Kubernetes RBAC and NetworkPolicy documentation, report reference [14] plus https://kubernetes.io/docs/concepts/services-networking/network-policies/.

## Slide 10. Validation crosses code, browser, and a real cluster

### Visible copy

| Layer | Evidence at `8ee601c` |
| --- | ---: |
| Go backend | 227 test functions |
| React frontend | 60 Vitest cases |
| Real-cluster browser workflows | 45 Playwright cases |
| GitHub Actions | 6 passed jobs |

CI also ran the race detector, vet, staticcheck, golangci-lint, govulncheck, production build, and CodeQL for Go and JavaScript/TypeScript.

### Visual

Use one horizontal testing path: Go and Vitest checks feed into a `kind` cluster plus Chromium E2E stage. Add the successful workflow URL as a small footer, not as the focal point.

### Speaker note

The strongest evidence is the E2E job because it starts the real backend and frontend against Kubernetes 1.34 and drives Chromium. Counts describe test inventory, while the retained workflow establishes pass status for this commit.

### Sources

GitHub Actions run `33142315221`; retained check-run JSON and Playwright archive.

## Slide 11. The evidence supports function, not unmeasured claims

### Visible copy

Met in the retained test scope:

- supported resources and pod workflows;
- live update convergence;
- multi-context isolation;
- historical state and diff;
- read-only cluster access.

Not yet measured:

- large-cluster performance and storage growth;
- accessibility;
- Firefox and WebKit behavior;
- clean-machine installation.

### Visual

Use a two-column evidence boundary. Avoid green checkmarks for items that are only supported by design review.

### Speaker note

This slide draws the line between test evidence and claims. No throughput, latency, user-study, or accessibility result should appear until the measurement is run and retained.

## Slide 12. The project history is traceable and must be classified accurately

### Visible copy

- 27 commits from 3 March to 28 August 2026
- 11 commit subjects linked to pull requests
- three recorded contributor identity groups
- complete dependency and commit inventories retained with the submission

`[PLACEHOLDER: approved student and collaborator contribution statement]`

### Visual

Use a restrained timeline with the major phases: Go backend, test and CI hardening, deployment and E2E, multi-context and live streams, flight recorder.

### Speaker note

Commit counts are not a proxy for academic contribution. Explain the student's actual design, implementation, testing, and documentation work only after the contributor roles have been agreed.

## Slide 13. KubeView proves a focused architecture and keeps its limits visible

### Visible copy

KubeView combines:

- read-only Kubernetes inspection;
- live resource and log streams;
- context-safe multi-cluster access;
- bounded historical reconstruction;
- real-cluster automated validation.

Next engineering priority: authenticated, context-aware access before shared deployment.

### Visual

Return to the strongest final-build product screenshot. Keep the closing claim and next priority on one slide. Do not add a separate generic thank-you slide.

### Speaker note

Close by restating the boundary. KubeView is an inspection and recent-history tool. It does not replace monitoring, alerting, tracing, or a production identity layer.

## Template and production checklist

- [ ] Obtain the official BITS PPTX template.
- [ ] Confirm required title, declaration, and closing slides.
- [ ] Replace all identity and contribution placeholders.
- [ ] Capture timeline and final-build screenshots at a consistent desktop resolution.
- [ ] Export the selected Mermaid diagrams to high-resolution SVG or PNG.
- [ ] Build the PPTX using inherited template layouts and masters.
- [ ] Add source blocks to speaker notes for external claims and assets.
- [ ] Render and inspect every slide for clipping, overlap, and small text.
- [ ] Rehearse to 10 to 12 minutes and remove content before shrinking type.
- [ ] Save the final editable PPTX and exported PDF.

