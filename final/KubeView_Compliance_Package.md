# KubeView plagiarism, originality, and attribution compliance package

## Project identification

- **Project:** KubeView
- **Programme:** BSc Computer Science, BITS Pilani Digital
- **Academic year:** 2025-2026
- **Source repository:** <https://github.com/varundeepsaini/kubeview>
- **Frozen source baseline:** `8ee601c`
- **Compliance record date:** 2 September 2026

**Student team:**

- Ankur Kalita (`2023EBCS782`)
- Pradyut Fogla (`2023EBCS788`)
- Varun Deep Saini (`2023EBCS663`)

## Purpose and status

This package records the available evidence for document originality, code provenance, third-party attribution, and student contribution. It distinguishes internal checks from reports produced by institution-approved plagiarism or code-similarity systems.

| Compliance item | Status | Evidence or required action |
| --- | --- | --- |
| Document provenance and internal repetition review | Complete | Final report source, project summary, README, and internal scan results |
| References and external-source identification | Complete | 17 numbered references in the report source |
| Code provenance | Complete | Frozen Git history containing 27 commits across the three student identity groups |
| Source archive integrity | Complete | SHA-256 checksum recorded below |
| Dependency attribution inventory | Complete | 591 Go and npm dependency records |
| Student contributor classification | Complete | All recorded contributor aliases are mapped to the three student team members |
| Institution-approved document similarity report | External attachment required | Run the final report PDF through the checker approved by the supervisor or institution |
| Institution-approved code similarity report or declaration | External attachment required if mandated | Use the approved method and retain its complete output |
| Supervisor acceptance of similarity findings | Human approval required | Supervisor reviews legitimate matches and signs the final report |

An internal scan cannot provide an institutional similarity percentage. No percentage is estimated or claimed in this package.

## Document originality review

### Material reviewed

The internal document review covered:

- the final project report Markdown source;
- the final project summary with UVP;
- the final user manual and installation guide; and
- the repository README used as a technical reference.

### Internal results

- The report contains 17 numbered references covering Kubernetes, client-go, Server-Sent Events, bbolt, Go, Kustomize, kind, Playwright, CodeQL, Vitest, Next.js, and Docker Compose.
- An exact normalized-paragraph comparison of the report source, final project summary, and final README found **zero duplicate groups** for paragraphs of at least 120 characters.
- Project descriptions, architecture explanations, security boundaries, validation results, and user procedures are written specifically for KubeView.
- Product names, API names, command names, configuration variables, and standard technical terms are retained where changing them would reduce accuracy.

These checks detect exact repetition within the project documents only. They do not search books, websites, academic databases, private repositories, or previous institutional submissions and therefore do not replace an approved similarity checker.

### Legitimate similarity categories

An external checker may identify legitimate matches caused by:

- official product and library names;
- Kubernetes resource names and RBAC verbs;
- commands required to install or validate the application;
- API paths and environment-variable names taken directly from the source code;
- standard bibliographic titles and URLs; and
- repeated project title, student details, and institutional wording.

These matches should be reviewed rather than automatically removed. Technical identifiers must remain exact.

### Document originality declaration

The student team declares that the submitted project documents describe the team's KubeView implementation. External technical concepts, products, libraries, and documentation are identified through references or attribution. No similarity percentage is claimed until the final document has been processed by the institution-approved system and its complete report has been retained.

## Code provenance and originality review

### Frozen source evidence

The submission is tied to Git commit `8ee601c`. The frozen archive is:

```text
kubeview-source-8ee601c.zip
SHA-256: 8a1da44011802158e57d4dcc067f50d08695315b9fe246bf328e73051e441d8f
```

The baseline contains 127 tracked files and 27 commits. The history records 11 pull-request-linked changes. Commit and pull-request records provide a reproducible path from the initial repository to the submitted implementation.

### Student contribution mapping

Git aliases were classified using the group information supplied for the submission:

| Student | Recorded Git identities | Commits | Repository-recorded areas |
| --- | --- | ---: | --- |
| Varun Deep Saini | `Varun Deep Saini` with three recorded email aliases | 18 | Initial repository, backend hardening, CI and security checks, configuration, deployment, end-to-end testing, frontend unit-test tooling, and flight recorder |
| Ankur Kalita | `ankur-kalita`, `Ankur` | 7 | Go backend, backend tests, repository documentation, Events view, and multi-context switching |
| Pradyut Fogla | `pradyutf` | 2 | Kubernetes and pod-log streaming, plus additional Kubernetes resource views |

Commit counts record repository history and do not by themselves measure effort, review work, design work, testing, documentation, or presentation contributions.

### Internal code checks

- The source-provenance audit found no `adapted from`, `copied from`, generated-code, copyright, or SPDX markers outside lockfiles and checksums using its configured pattern scan.
- Git history, pull-request references, source paths, and author aliases were preserved rather than flattened into an unattributed code snapshot.
- Generated dependency lockfiles are treated as tool output and are not claimed as original source.
- Standard Kubernetes API types, Go and TypeScript language patterns, framework configuration, Dockerfiles, and Kubernetes manifests may resemble conventional examples because their syntax is constrained by the relevant platforms.
- CodeQL and govulncheck results provide security evidence, not plagiarism evidence, and are not presented as originality checks.

The marker scan and Git history support provenance review but do not prove that the code has no similarity with external repositories. An approved code-similarity process remains necessary when required by institutional policy.

### Code originality declaration

The student team declares that the submitted application source represents the KubeView group project at commit `8ee601c`. Third-party packages are consumed through Go modules and npm rather than presented as student-authored source. Generated lockfiles and unused framework starter assets are excluded from originality claims. Any external code-similarity result must be attached without alteration and reviewed in the context of framework conventions and required platform syntax.

## Third-party software attribution

The dependency inventory contains 591 direct and transitive package records extracted from `go.mod` and npm lockfiles. It records ecosystem, component, package, version, direct or transitive relationship, development status, optional status, manifest-provided licence data, source file, and installation path.

Primary direct dependencies include:

| Component | Direct dependencies |
| --- | --- |
| Go backend | bbolt, Kubernetes API, apimachinery, and client-go |
| Next.js frontend | Next.js, React, React DOM, Tailwind CSS, TypeScript, ESLint, Vitest, Testing Library, and related build/test packages |
| End-to-end tests | Playwright |

npm licence identifiers are retained where the package lockfile records them. Go module manifests do not include licence identifiers, so the inventory correctly labels those values as not recorded rather than guessing them.

Third-party packages remain subject to their upstream licences. The dependency inventory is an attribution and review aid; it is not a substitute for legal licence analysis. The repository has no top-level project licence, so no distribution licence is asserted by this academic submission package.

## External assets and generated material

- Product screenshots are captures of the KubeView application.
- Architecture figures were prepared specifically for the project from its implementation.
- The BITS logo and presentation styling come from the official supplied capstone presentation template.
- Five unused SVG files under `kubeview-frontend/public/` originated with the frontend starter structure. They are not used in the demonstrated interface and are not claimed as original project artwork.
- The recorded demonstration consists of project-execution footage. Any soundtrack or external media added during final editing must be attributed separately.

## AI-assisted work disclosure

AI-assisted tools were used during submission preparation for documentation structuring, language editing, review support, and consistency checking. The student team remains responsible for verifying technical claims, source code, test evidence, citations, compliance statements, and the final submitted material. This disclosure should be retained or adjusted only to match the wording required by the institution or supervisor.

## Supporting evidence

- [Internal originality and provenance audit](../compliance/INTERNAL_ORIGINALITY_AUDIT.md)
- [Dependency inventory](../inventories/DEPENDENCY_INVENTORY.csv)
- [Contribution summary](../inventories/CONTRIBUTION_SUMMARY.md)
- [Contribution history](../inventories/CONTRIBUTION_HISTORY.csv)
- [Source archive checksum](../source/SHA256SUMS.txt)
- [Validation report](../drafts/VALIDATION_REPORT.md)
- [Retained CI evidence](../evidence/ci/README.md)

## Required external attachments

Complete the following after the project documents stop changing:

1. Export the final report to PDF.
2. Submit the complete PDF to the document-similarity system approved by BITS or the supervisor.
3. Download and retain the complete unedited similarity report, including tool name, date, submission identifier, percentage, and match details.
4. Review matches caused by references, technical identifiers, standard commands, and institutional wording.
5. Run the institution-approved code-similarity process if one is required, or obtain written supervisor confirmation that this provenance and attribution package is sufficient.
6. Retain the complete code report or declaration with the frozen commit and source-archive checksum.
7. Give both results and the explanation of legitimate matches to the supervisor before report sign-off.

The compliance package becomes externally complete only when the required reports or written waivers are attached. Until then, the internal evidence is complete but the institutional plagiarism-compliance gate remains open.
