# Plagiarism, licence, and attribution working record

This document is a preparation record. It is not an institutional plagiarism certificate.

## Authorship record

The Git history for the current repository includes commits under the following identities:

- Varun Deep Saini
- Ankur / ankur-kalita
- pradyutf

Before submission, classify each person as a student, formal project teammate, external contributor, or reviewer. The final contribution statement must describe work accurately. Commit count alone is not a reliable measure of contribution.

## Code originality procedure

- [ ] Freeze the final commit and tag.
- [ ] Record every contributor and merged pull request.
- [ ] Identify copied or adapted snippets that are not ordinary API usage.
- [ ] Review generated files and exclude them from originality claims.
- [ ] Run the institution-approved code-similarity process if one exists.
- [ ] Preserve the tool, version, date, scope, and complete output.
- [ ] Explain legitimate matches caused by framework conventions, Kubernetes API types, manifests, and standard configuration.

## Document originality procedure

- [ ] Cite Kubernetes, Go, Next.js, React, bbolt, Docker, `kind`, Playwright, Vitest, CodeQL, and related sources where discussed.
- [ ] Cite every product comparison and borrowed diagram.
- [ ] Use original wording for architecture and implementation descriptions.
- [ ] Run the final PDF through the institution-approved similarity checker.
- [ ] Record the similarity percentage and supervisor response.
- [ ] Keep quotations short and clearly marked.

## AI-assistance disclosure

Use `[PLACEHOLDER: wording required by institutional policy]`. Do not omit or invent disclosure requirements. The final statement should distinguish assistance with editing, code, testing, diagrams, and media where applicable.

## Third-party dependencies

The project depends on open-source packages managed through Go modules and npm lockfiles. Primary direct dependencies include Kubernetes `client-go`, Kubernetes API libraries, bbolt, Next.js, React, Tailwind CSS, Vitest, Testing Library, and Playwright.

`submission/inventories/DEPENDENCY_INVENTORY.csv` records 591 package installations from `go.mod` and both npm lockfiles. It includes ecosystem, component, package, version, direct or transitive relationship, development and optional flags, source file, and licence metadata when the source records it. npm licence values come from the lockfiles. Go licence identifiers remain marked as not recorded because `go.mod` does not contain them.

- [x] Generate the dependency inventory from frozen source metadata.
- [x] Preserve direct and transitive relationships where the manifests expose them.
- [ ] Verify Go module licences against authoritative upstream repositories.
- [ ] Review npm rows whose lockfile does not record a licence.
- [ ] Check whether any dependency licence requires notice text in the distributed ZIP.

The repository currently has no top-level `LICENSE` file. Project ownership and distribution terms must be agreed before assigning one.

## Contribution evidence

`submission/inventories/CONTRIBUTION_HISTORY.csv` records all 27 commits reachable from `8ee601c`. `submission/inventories/CONTRIBUTION_SUMMARY.md` groups author aliases without assigning academic roles. Commit subjects identify 11 pull-request-linked changes.

- [x] Preserve commit, date, author identity, subject, and pull-request reference where present.
- [ ] Classify Varun Deep Saini, Ankur Kalita, and `pradyutf` accurately.
- [ ] Write and approve the assessed contribution statement.

## External assets

- [ ] Record the origin and licence of every logo, icon, screenshot, font, diagram, poster image, and video soundtrack.
- [ ] Prefer repository screenshots, self-created diagrams, and royalty-free or institution-approved audio.
- [ ] Follow the Kubernetes trademark and artwork guidelines if Kubernetes artwork is used.

## Required attachments

- `submission/compliance/INTERNAL_ORIGINALITY_AUDIT.md`
- `[PLACEHOLDER: document plagiarism report filename]`
- `[PLACEHOLDER: code compliance report filename]`
- `[PLACEHOLDER: signed originality declaration filename]`
- `[PLACEHOLDER: approved contribution statement filename]`
