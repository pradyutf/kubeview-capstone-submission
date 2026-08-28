#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const [sourceArg = ".", submissionArg = "submission", outputArg = "submission/compliance/INTERNAL_ORIGINALITY_AUDIT.md"] = process.argv.slice(2);
const sourceRoot = resolve(sourceArg);
const submissionRoot = resolve(submissionArg);
const outputPath = resolve(outputArg);

const git = (...args) => execFileSync("git", args, { cwd: sourceRoot, encoding: "utf8" }).trim();
const trackedFiles = git("ls-files").split("\n").filter(Boolean);
const commitCount = Number(git("rev-list", "--count", "8ee601c"));
const authorLines = git("shortlog", "-sne", "8ee601c").split("\n").filter(Boolean);
const dependencyRows = readFileSync(join(submissionRoot, "inventories/DEPENDENCY_INVENTORY.csv"), "utf8").trim().split("\n").length - 1;

const markerPattern = /SPDX-License-Identifier|copyright|code generated|adapted from|copied from/i;
const markerHits = [];
for (const relative of trackedFiles) {
  if (/package-lock\.json$|go\.sum$/.test(relative)) continue;
  let body;
  try {
    body = readFileSync(join(sourceRoot, relative), "utf8");
  } catch {
    continue;
  }
  body.split("\n").forEach((line, index) => {
    if (markerPattern.test(line)) markerHits.push(`${relative}:${index + 1}`);
  });
}

const prosePaths = [
  join(submissionRoot, "drafts/FINAL_REPORT_DRAFT.md"),
  join(submissionRoot, "drafts/PROJECT_SUMMARY.md"),
  join(sourceRoot, "README.md"),
];
const paragraphs = [];
for (const path of prosePaths) {
  const parts = readFileSync(path, "utf8")
    .split(/\n\s*\n/)
    .map((text) => text.replace(/\s+/g, " ").trim())
    .filter((text) => text.length >= 120 && !text.startsWith("|") && !text.startsWith("```"));
  for (const text of parts) paragraphs.push({ source: basename(path), text });
}

const grouped = new Map();
for (const paragraph of paragraphs) {
  const sources = grouped.get(paragraph.text) ?? [];
  sources.push(paragraph.source);
  grouped.set(paragraph.text, sources);
}
const duplicateGroups = [...grouped.entries()].filter(([, sources]) => sources.length > 1);

const publicAssets = trackedFiles.filter((path) => path.startsWith("kubeview-frontend/public/") && path.endsWith(".svg"));
const report = readFileSync(prosePaths[0], "utf8");
const referenceCount = (report.match(/^\[\d+\] /gm) ?? []).length;

const lines = [
  "# Internal originality and provenance audit",
  "",
  "Audit date: 28 August 2026",
  "",
  "Source baseline: commit `8ee601c`",
  "",
  "> This is an internal evidence check. It is not a Turnitin, Ouriginal, MOSS, JPlag, or institution-approved plagiarism result.",
  "",
  "## Results",
  "",
  "| Check | Result | Interpretation |",
  "| --- | --- | --- |",
  `| Git provenance | ${commitCount} commits and ${authorLines.length} recorded author identities or aliases | Contributor roles still require human classification. |`,
  `| Tracked source scope | ${trackedFiles.length} files | The audit used files tracked at the frozen commit. |`,
  `| Dependency provenance | ${dependencyRows} inventory rows | Third-party packages are identified; licence verification remains open where manifests omit it. |`,
  `| Source attribution markers | ${markerHits.length} matches outside lockfiles and checksums | No embedded copyright, generated-code, or copied/adapted-source marker was found by this pattern scan. This does not prove originality. |`,
  `| Exact long-paragraph repetition | ${duplicateGroups.length} duplicate groups across the report, project summary, and repository README | Exact reuse inside project-owned documentation is reported below and is not an external similarity result. |`,
  `| Report references | ${referenceCount} numbered entries | References must be reformatted to the institution's required citation style. |`,
  `| Top-level project licence | ${existsSync(join(sourceRoot, "LICENSE")) ? "Present" : "Absent"} | Distribution terms must be confirmed before release. |`,
  "",
  "## Contributor provenance",
  "",
  ...authorLines.map((line) => `- ${line.replace(/^\s+/, "")}`),
  "",
  "These identities come from Git metadata. They do not establish which work may be claimed by the student. The final contribution statement must classify each person and describe their work.",
  "",
  "## Exact prose repetition",
  "",
];

if (duplicateGroups.length === 0) {
  lines.push("No exact duplicate paragraph of at least 120 normalized characters was found across the three scanned project documents.");
} else {
  duplicateGroups.forEach(([text, sources], index) => {
    lines.push(`${index + 1}. Sources: ${sources.join(", ")}`);
    lines.push(`   Text: ${text}`);
  });
}

lines.push(
  "",
  "This comparison detects exact repeated project prose only. It does not search books, papers, websites, private repositories, or institutional databases.",
  "",
  "## Repository assets needing a final decision",
  "",
  `The frontend public directory contains ${publicAssets.length} SVG starter assets:`,
  "",
  ...publicAssets.map((path) => `- \`${path}\``),
  "",
  "No source reference to these filenames was found during the repository audit. Remove unused starter assets before the final release or record their upstream origin and licence if retained.",
  "",
  "## External results to attach",
  "",
  "- `[PLACEHOLDER: institution-approved document similarity tool]`",
  "- `[PLACEHOLDER: final document similarity percentage and report filename]`",
  "- `[PLACEHOLDER: institution-approved code similarity method or declaration]`",
  "- `[PLACEHOLDER: final code similarity result and report filename]`",
  "- `[PLACEHOLDER: supervisor's review of similarity findings]`",
  "",
  "## Sign-off rule",
  "",
  "Do not replace the placeholders with an estimated percentage. Attach the complete reports, explain legitimate matches, and obtain supervisor acceptance before signing the final report.",
  "",
);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, lines.join("\n"));
console.log(`Wrote ${outputPath}`);
