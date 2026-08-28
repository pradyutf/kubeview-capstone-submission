# [PLACEHOLDER: official project title]

Project summary for `[PLACEHOLDER: programme and semester]`

Student: `[PLACEHOLDER: student name and BITS ID]`  
Supervisor: `[PLACEHOLDER: supervisor name and designation]`  
Submission date: `[PLACEHOLDER: submission date]`

## Executive summary

KubeView is a read-only web application for inspecting Kubernetes clusters. It combines a Go backend, a Next.js frontend, live event streaming, multi-cluster switching, and a local history recorder. Users can inspect current workloads, follow pod logs, and reconstruct earlier cluster state through a browser instead of combining several `kubectl` commands and terminal sessions.

The project targets developers, students, and small platform teams that need fast operational visibility but do not need a full observability stack. KubeView reads Kubernetes resources through the official `client-go` library. It does not create, modify, or delete cluster objects. This restricted behavior reduces operational risk and makes the system suitable for demonstrations, development clusters, incident review, and teaching.

## Problem

Kubernetes exposes detailed state through its API, but the default command-line workflow scatters that information across commands. A developer may use `kubectl get`, `describe`, `logs`, context switching, and event queries during one investigation. The commands are effective, but they provide a live snapshot. Once a short failure or rollout transition has passed, the terminal output is gone unless another monitoring system recorded it.

Established observability platforms solve a broader problem. Prometheus, Grafana, log aggregation, and tracing systems collect long-term telemetry and support production operations. They also require deployment, configuration, storage, and maintenance. That cost is reasonable for production infrastructure but excessive for a student cluster, a local development environment, or a focused troubleshooting session.

KubeView addresses the space between raw command-line inspection and a full monitoring platform. It presents Kubernetes state in a browser, updates resource rows through Server-Sent Events, streams pod logs, supports multiple kubeconfig contexts, and records a bounded history of resource changes.

## Unique value proposition

KubeView gives a developer a read-only live view and a 72-hour replayable history of multiple Kubernetes clusters without requiring a metrics or log-monitoring stack.

Four choices make that proposition concrete:

1. The backend uses Kubernetes watch streams instead of repeated five-second list requests. Fast state changes can reach the browser as they happen.
2. A local flight recorder stores bounded historical state and events. The user can inspect a past moment and compare two points in time.
3. Multi-context support allows the same interface to switch between configured clusters without restarting the application.
4. Read-only Kubernetes permissions prevent the application from changing workloads. KubeView is an inspection tool, not an administration console.

This scope is deliberate. KubeView does not attempt to replace production monitoring, tracing, alerting, or policy enforcement.

## Objectives

The project has the following objectives:

- provide a browser interface for common Kubernetes resources;
- update visible state without periodic full-list polling;
- stream logs from selected pod containers;
- support namespace filtering and kubeconfig context switching;
- retain a bounded record of resource state changes;
- compare historical states and associate changes with Kubernetes events;
- run locally, through Docker Compose, or inside Kubernetes;
- enforce read-only cluster access;
- verify behavior through unit, integration, end-to-end, static-analysis, and security checks.

## System design

The frontend is a Next.js 16 application written in TypeScript and React. It renders the dashboard, resource tables, pod details, context selector, and timeline controls. REST requests load the initial state. An `EventSource` connection receives later resource changes from the backend. This arrangement provides an immediate complete view while avoiding repeated full-list requests.

The backend is written in Go and uses the standard `net/http` server. Kubernetes access is implemented with `client-go`. The backend loads a local kubeconfig when available and uses an in-cluster service account when deployed inside Kubernetes. It transforms Kubernetes API objects into smaller response structures designed for the frontend.

The live-update path uses Kubernetes watch streams and Server-Sent Events. The backend forwards added, modified, and deleted resource events to connected browsers. It stops watches when a client disconnects and allows the browser to reconnect after stream interruption.

The history subsystem records resource versions and Kubernetes events in an embedded bbolt database. Retention defaults to 72 hours and can be configured. The frontend can request state at a selected timestamp and compare two timestamps. The comparison reports changes such as container-image updates, restart-count changes, replica changes, and condition transitions.

## Functional scope

The current application covers namespaces, pods, deployments, services, nodes, events, ConfigMaps, Secrets, Ingresses, StatefulSets, and DaemonSets. Pod detail includes regular containers, init containers, native sidecars, ephemeral containers, conditions, volumes, and logs. Secret list responses expose keys and byte lengths rather than values. A separate explicit reveal action requests secret values.

The application supports kubeconfig context switching. API calls, live streams, and historical state remain associated with the selected context. The dashboard provides live workload health counts, while the timeline provides a past-state mode and state-difference view.

## Security approach

KubeView uses read-only Kubernetes permissions. The supplied `ClusterRole` grants `get`, `list`, and `watch` access only to displayed resource types and pod logs. It does not grant mutation verbs. The Kubernetes deployment also includes a NetworkPolicy that limits backend ingress to the frontend pod.

The backend API itself does not authenticate users. This is an explicit limitation. Pod logs and revealed Secret values may contain sensitive information. The backend must not be exposed directly through a public Ingress or LoadBalancer without an authentication layer. The final report will include this boundary in the threat model and deployment guidance.

## Validation approach

The repository contains several test layers. The Go backend has 227 test functions covering handlers, Kubernetes clients, transformations, streaming behavior, historical storage, state reconstruction, and diff logic. The frontend has 60 Vitest cases. Playwright contains 45 end-to-end cases that run the real frontend and backend against a real `kind` cluster.

Continuous integration builds the backend, runs Go tests with the race detector and coverage, checks formatting, and runs `go vet`, staticcheck, golangci-lint, and govulncheck. Frontend checks include TypeScript compilation, ESLint, unit tests, and a production build. CodeQL scans Go and JavaScript/TypeScript. The end-to-end job creates a pinned Kubernetes cluster, applies test fixtures, starts both applications, and runs Chromium-based scenarios.

These counts describe the current repository. The final validation report will contain fresh execution dates, tool versions, pass or fail results, coverage values, logs, and links to retained evidence. No result will be reported as passing until that run is complete.

## Current limitations

- The backend API has no built-in user authentication or authorization.
- The history database is local to one backend instance and is not designed for horizontal replication.
- The application is an inspection interface and does not provide alerts, metrics dashboards, distributed tracing, or workload mutation.
- Historical accuracy depends on active watches and configured retention.
- Large clusters require further load and memory evaluation.
- Secret reveal is powerful and should be restricted by deployment-level access controls.

## Expected outcome

The project demonstrates how Kubernetes API primitives can support a focused operational tool without a large infrastructure footprint. Its technical contribution is the combination of live resource watches, multi-context isolation, bounded historical reconstruction, and a read-only web interface. The final evaluation will measure correctness, reproducibility, test coverage, security checks, and the usability of the main diagnostic workflows.

## Repository

`[PLACEHOLDER: final GitHub repository URL and release tag]`

