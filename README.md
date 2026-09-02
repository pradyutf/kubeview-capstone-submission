# KubeView final submission tracker

Working baseline: `origin/master` at commit `8ee601c` on 28 August 2026.

This directory tracks the academic submission. Fields that need institutional or personal information use the format `[PLACEHOLDER: description]`. Missing metadata does not block technical writing, evidence collection, or packaging.

Markdown files are the working sources until content review is complete. Existing DOCX and PDF files are retained only as layout previews; do not regenerate them until the report content and placeholders are approved.

## Final deliverables available

- [Project summary with UVP](final/KubeView_Project_Summary.md)
- [User manual and installation guide](final/README.md)
- [BITS final presentation](final/KubeView_BITS_Final_Presentation.pptx)

## Collaboration

`main` holds the latest agreed submission material. Make content changes on a short-lived branch and open a pull request so the group can review wording, evidence, and placeholder replacement. Edit the Markdown sources first. Regenerate DOCX, PDF, PPTX, and ZIP outputs only at an agreed milestone.

## Progress

- [x] Audit current source tree and Git history
- [x] Inventory automated tests and CI checks
- [x] Install the Unslop and Ponytail skill sets
- [x] Draft project summary with a stated UVP
- [x] Finalize the project summary with UVP
- [x] Define the final report structure
- [x] Create the placeholder and manual-action register
- [ ] Run tests against the frozen submission commit
- [x] Capture CI lint, security, build, and E2E evidence
- [x] Build the first test-case and requirements-traceability matrix
- [x] Draft all final-report chapters
- [x] Generate and visually verify an initial 41-page layout preview
- [ ] Export the approved report to DOCX and PDF after content review
- [x] Create system, live-update, context-isolation, history, and deployment diagrams
- [x] Generate dependency and contribution inventories
- [x] Run and retain the internal originality and provenance audit
- [x] Draft the user manual and installation guide
- [x] Combine and finalize the user manual and installation guide
- [x] Produce the source-code ZIP and checksum
- [x] Verify source ZIP integrity and SHA-256 checksum
- [x] Verify JSON, XLSX, and reproducible inventory outputs
- [x] Create `SOURCE_CODE_LINK.txt`
- [x] Create the final-presentation content storyboard
- [x] Create the BITS-format presentation
- [x] Prepare the demo script, recording checklist, and viva questions
- [x] Record the demo video
- [ ] Upload the demo video and add its final link
- [ ] Decide whether a marketing video is required
- [ ] Create the social-media poster
- [ ] Run document plagiarism checking
- [ ] Complete code attribution and licence review
- [ ] Obtain supervisor review and signature
- [ ] Assemble and verify the final upload folder

## Evidence already present in the repository

| Area | Current evidence |
| --- | --- |
| Backend tests | 227 Go test functions |
| Frontend tests | 60 Vitest test cases |
| End-to-end tests | 45 Playwright test cases against a real `kind` cluster |
| Backend quality | Build, race detector, coverage, `go vet`, staticcheck, golangci-lint, govulncheck |
| Frontend quality | Type check, ESLint, unit tests, production build |
| Security | CodeQL for Go and JavaScript/TypeScript, read-only RBAC, NetworkPolicy |
| Deployment | Dockerfiles, Docker Compose, Kubernetes manifests, Kustomize |
| Product behavior | Multi-cluster switching, live SSE updates, live logs, resource views, historical state and diff timeline |

Counts above describe the source tree. They are not final pass results. The validation phase will run every command and preserve dated output.

## Working deliverable map

| Deliverable | Working source | Final form | Status |
| --- | --- | --- | --- |
| Final report | `drafts/FINAL_REPORT_DRAFT.md` | Signed PDF | Markdown review copy complete; supervisor metadata, responsibility split, external similarity reports and approval pending. Final export is deferred. |
| Project summary | `final/KubeView_Project_Summary.md` | Shared document or PDF | Final Markdown complete with UVP |
| Architecture | `architecture/ARCHITECTURE.md` | Report figures and presentation assets | Six editable diagrams complete; system-context figure embedded in the report |
| Source code | Commit `8ee601c` | ZIP and SHA-256 file | Complete |
| Source link | Repository URL | TXT | Complete; access decision pending |
| Test and validation report | CI and local runs | PDF plus evidence archive | Drafted; local release checks pending |
| Plagiarism compliance | `compliance/INTERNAL_ORIGINALITY_AUDIT.md`, attribution and dependency inventories, external reports | PDF | Internal audit complete; approved external reports pending |
| User manual and installation guide | `final/README.md` | README or PDF | Final combined Markdown complete |
| Presentation | `final/KubeView_BITS_Final_Presentation.pptx` | PPTX | Complete; demo video can be embedded or linked later |
| Demo video | Recorded demonstration | Hosted video and TXT link | Recording complete; upload and final link pending |
| Marketing video | Short product narrative | Hosted video and TXT link | Decision pending |
| Poster | UVP, architecture, results, QR links | PDF and PNG | Pending |

## Rules for finalization

1. Do not claim a test passed unless its retained output proves it.
2. Do not include credentials, kubeconfig files, cluster secrets, databases, dependency caches, or build output in the source ZIP.
3. Do not fabricate signatures, similarity scores, user studies, performance results, or supervisor approval.
4. Attribute third-party libraries, external contributors, generated assets, and any assistance required by institutional policy.
5. Replace every placeholder before the final PDF and ZIP are uploaded.
