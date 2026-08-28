# KubeView validation report

Report status: evidence-backed draft  
Source commit: `8ee601c`  
CI run date: 28 August 2026  
Workflow run: https://github.com/varundeepsaini/kubeview/actions/runs/33142315221

## Validation scope

This report records automated checks for the Go backend, Next.js frontend, Kubernetes integration, deployment behavior, and security analysis. The evidence applies to commit `8ee601c`. A later source change requires a new run.

## Result summary

| Check | Result | Evidence |
| --- | --- | --- |
| Backend tests with race detector and coverage | Pass | https://github.com/varundeepsaini/kubeview/actions/runs/33142315221/job/98755632174 |
| Backend formatting, vet, staticcheck, golangci-lint, govulncheck | Pass | https://github.com/varundeepsaini/kubeview/actions/runs/33142315221/job/98755632178 |
| Frontend type check, ESLint, Vitest, production build | Pass | https://github.com/varundeepsaini/kubeview/actions/runs/33142315221/job/98755632018 |
| CodeQL for Go | Pass | https://github.com/varundeepsaini/kubeview/actions/runs/33142315221/job/98755632217 |
| CodeQL for JavaScript and TypeScript | Pass | https://github.com/varundeepsaini/kubeview/actions/runs/33142315221/job/98755632255 |
| Playwright against a real `kind` cluster | Pass | https://github.com/varundeepsaini/kubeview/actions/runs/33142315221/job/98755632131 |

All six jobs completed successfully. The run began at 04:36 UTC and the last job completed at 04:41 UTC.

## Test inventory

- 227 Go test functions in backend test files
- 60 frontend unit and component test cases
- 45 Playwright end-to-end test cases

These are source counts, not weighted coverage values. The CI job generated Go coverage data but did not retain the coverage file as a workflow artifact. The final submission should either add coverage artifact retention or run coverage locally and preserve the output.

## Backend validation

The backend CI job runs:

```bash
go build ./...
go test -race -covermode=atomic -coverprofile=coverage.out ./...
```

The backend lint job verifies `go mod tidy`, `gofmt`, `go vet`, staticcheck, golangci-lint, and govulncheck. This combination checks compilation, race conditions exercised by tests, dependency consistency, formatting, suspicious Go constructs, configured lint rules, and known Go vulnerabilities.

The backend tests cover HTTP handlers, kubeconfig loading, multi-context clients, response transformations, Kubernetes watch streams, pod log streaming, historical storage, retention, reconstruction, and state differences.

### Local backend attempt

A local `go test ./...` run was attempted on 28 August 2026 from the detached `8ee601c` worktree. The machine had Go 1.26.5, so Go downloaded the exact 1.26.6 toolchain required by `go.mod` and the locked modules. Compilation reached the linker, which failed with `no space left on device`. Only 1.2 GiB remained on the data volume at that point. The temporary Go caches created for the attempt were cleaned afterward.

This attempt is not a test pass or a product failure. It is an incomplete local run caused by host storage capacity. The successful GitHub Actions backend job remains the retained pass evidence for this commit. A fresh local run still requires sufficient free disk space.

## Frontend validation

The frontend job runs locked dependency installation, TypeScript checking, ESLint with zero warnings allowed, Vitest, and the Next.js production build. Tests cover API URL construction, watch reconciliation, cluster and time-travel providers, navigation, resource pages, the sidebar, timeline controls, and historical pod rendering.

## End-to-end validation

The E2E job creates a Kubernetes 1.34 `kind` cluster and applies controlled fixtures. It preloads BusyBox 1.36, waits for pods and workloads, builds both applications, installs Chromium, and runs Playwright.

The scenarios cover dashboard counts, namespace and search behavior, pods, multi-container detail, log streaming, deployments, services, nodes, events, ConfigMaps, Secrets, Ingresses, StatefulSets, DaemonSets, navigation, live updates, and historical comparison.

The retained Playwright artifact is `submission/evidence/ci/playwright-report-8ee601c.zip`. Its SHA-256 digest is:

```text
0609a544f0b7c76bcd94442bceb93b90ad2e3430bd9fe6b7a6c3675b16a2d62f
```

## Security validation

CodeQL completed successfully for Go and JavaScript/TypeScript with the `security-extended` query suite. Govulncheck also ran in the backend lint job. These checks reduce risk but do not prove the absence of vulnerabilities.

The deployment manifests use `get`, `list`, and `watch` permissions for supported resource types. Mutation verbs are excluded. A NetworkPolicy limits backend ingress to the frontend deployment.

## Traceability status

- [x] Live resource inspection has unit and E2E coverage.
- [x] Multi-container pod handling has E2E coverage.
- [x] Live logs have streaming tests and E2E coverage.
- [x] Additional Kubernetes resource pages have E2E coverage.
- [x] Secret masking and explicit reveal have E2E coverage.
- [x] Multi-context behavior has backend and frontend tests.
- [x] Historical state and comparison have backend, frontend, and E2E coverage.
- [ ] Performance limits need measured results.
- [ ] Accessibility needs a dedicated audit.
- [ ] Browser coverage currently uses Chromium only.
- [ ] External authentication is not implemented.

## Residual risk

The application has no built-in user authentication. A person who can reach the backend can request cluster metadata, logs, and Secret values allowed by the backend service account. The supplied network restriction is necessary but does not replace user authentication for public deployment.

The history store runs inside one backend instance. The project has not established behavior under horizontal replication or very large cluster churn. These limits must remain visible in the report and presentation.

## Final evidence still required

- [ ] Preserve a coverage percentage and HTML coverage output.
- [ ] Run the release commit locally using the documented installation steps.
- [ ] Capture version output for Go, Node.js, Docker, kubectl, kind, and Chromium.
- [ ] Run an accessibility audit on the main workflows.
- [x] Record and verify the release ZIP checksum.
- [ ] Re-run CI after the final documentation and release commit if source changes.

## Artifact integrity checks

- [x] `kubeview-source-8ee601c.zip` passed `unzip -t`.
- [x] The source ZIP matched the SHA-256 value in `submission/source/SHA256SUMS.txt`.
- [x] `check-runs-8ee601c.json` parsed successfully as JSON.
- [x] `KubeView_Test_Case_Matrix.xlsx` passed ZIP container integrity checks.
- [x] A clean inventory regeneration produced files identical to the retained dependency and contribution inventories.
