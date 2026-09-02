# Internal originality and provenance audit

Audit date: 28 August 2026

Contributor classification reviewed: 2 September 2026

Source baseline: commit `8ee601c`

> This is an internal evidence check. It is not a Turnitin, Ouriginal, MOSS, JPlag, or institution-approved plagiarism result.

## Results

| Check | Result | Interpretation |
| --- | --- | --- |
| Git provenance | 27 commits and 6 recorded author identities or aliases | All aliases are mapped to the three student team members in the contribution inventory. |
| Tracked source scope | 127 files | The audit used files tracked at the frozen commit. |
| Dependency provenance | 591 inventory rows | Third-party packages are identified; licence verification remains open where manifests omit it. |
| Source attribution markers | 0 matches outside lockfiles and checksums | No embedded copyright, generated-code, or copied/adapted-source marker was found by this pattern scan. This does not prove originality. |
| Exact long-paragraph repetition | 1 duplicate groups across the report, project summary, and repository README | Exact reuse inside project-owned documentation is reported below and is not an external similarity result. |
| Report references | 17 numbered entries | References must be reformatted to the institution's required citation style. |
| Top-level project licence | Absent | Distribution terms must be confirmed before release. |

## Contributor provenance

- 16	Varun Deep Saini <deepsainivarun@gmail.com>
- 4	ankur-kalita <forgivemeankur11@gmail.com>
- 3	Ankur <143007590+ankur-kalita@users.noreply.github.com>
- 2	pradyutf <p.fogla@rippling.com>
- 1	Varun Deep Saini <v.saini@rippling.com>
- 1	Varun Deep Saini <varun.23bcs10048@ms.sst.scaler.com>

These identities come from Git metadata. They map to Varun Deep Saini, Ankur Kalita, and Pradyut Fogla, the three members of the submitted student group. Commit counts alone do not measure total project contribution.

## Exact prose repetition

1. Sources: FINAL_REPORT_DRAFT.md, PROJECT_SUMMARY.md
   Text: KubeView gives a developer a read-only live view and a 72-hour replayable history of multiple Kubernetes clusters without requiring a metrics or log-monitoring stack.

This comparison detects exact repeated project prose only. It does not search books, papers, websites, private repositories, or institutional databases.

## Repository assets needing a final decision

The frontend public directory contains 5 SVG starter assets:

- `kubeview-frontend/public/file.svg`
- `kubeview-frontend/public/globe.svg`
- `kubeview-frontend/public/next.svg`
- `kubeview-frontend/public/vercel.svg`
- `kubeview-frontend/public/window.svg`

No source reference to these filenames was found during the repository audit. Remove unused starter assets before the final release or record their upstream origin and licence if retained.

## External results to attach

- Complete report from the institution-approved document similarity tool
- Final document similarity percentage and match details
- Institution-approved code similarity report or written declaration that it is not required
- Supervisor review and acceptance of legitimate similarity findings

## Sign-off rule

Do not provide an estimated percentage. Attach the complete reports, explain legitimate matches, and obtain supervisor acceptance before signing the final report.
