#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const [sourceArg = ".", outputArg = "submission/inventories"] = process.argv.slice(2);
const sourceRoot = resolve(sourceArg);
const outputRoot = resolve(outputArg);
mkdirSync(outputRoot, { recursive: true });

const csv = (rows) =>
  rows
    .map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n") + "\n";

const dependencyRows = [[
  "ecosystem",
  "component",
  "package",
  "version",
  "relationship",
  "development_only",
  "optional",
  "licence_from_source",
  "source_file",
  "installation_path",
]];

const goModPath = join(sourceRoot, "kubeview-backend/go.mod");
const goMod = readFileSync(goModPath, "utf8");
for (const line of goMod.split("\n")) {
  const match = line.match(/^\s*([^\s]+)\s+(v[^\s]+)(\s+\/\/ indirect)?$/);
  if (!match) continue;
  dependencyRows.push([
    "Go",
    "backend",
    match[1],
    match[2],
    match[3] ? "transitive" : "direct",
    "false",
    "false",
    "Not recorded in go.mod",
    "kubeview-backend/go.mod",
    "",
  ]);
}

for (const [component, lockRelative] of [
  ["frontend", "kubeview-frontend/package-lock.json"],
  ["end-to-end tests", "kubeview-e2e/package-lock.json"],
]) {
  const lock = JSON.parse(readFileSync(join(sourceRoot, lockRelative), "utf8"));
  const root = lock.packages?.[""] ?? {};
  const directNames = new Set([
    ...Object.keys(root.dependencies ?? {}),
    ...Object.keys(root.devDependencies ?? {}),
    ...Object.keys(root.optionalDependencies ?? {}),
  ]);

  for (const [installationPath, pkg] of Object.entries(lock.packages ?? {})) {
    if (!installationPath || !pkg.version) continue;
    const packageName = pkg.name ?? installationPath.split("node_modules/").at(-1);
    dependencyRows.push([
      "npm",
      component,
      packageName,
      pkg.version,
      directNames.has(packageName) ? "direct" : "transitive",
      String(Boolean(pkg.dev)),
      String(Boolean(pkg.optional)),
      pkg.license ?? "Not recorded in package-lock.json",
      lockRelative,
      installationPath,
    ]);
  }
}

dependencyRows.splice(1, dependencyRows.length - 1, ...dependencyRows.slice(1).sort((a, b) =>
  a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]) || a[2].localeCompare(b[2]) || a[3].localeCompare(b[3]),
));
writeFileSync(join(outputRoot, "DEPENDENCY_INVENTORY.csv"), csv(dependencyRows));

const log = execFileSync(
  "git",
  ["log", "8ee601c", "--reverse", "--date=short", "--pretty=format:%h%x09%ad%x09%an%x09%ae%x09%s"],
  { cwd: sourceRoot, encoding: "utf8" },
);
const commits = log.trim().split("\n").map((line) => line.split("\t"));
const contributionRows = [["commit", "date", "author_name", "author_email", "subject", "linked_pr", "role"]];
for (const [commit, date, name, email, subject] of commits) {
  contributionRows.push([
    commit,
    date,
    name,
    email,
    subject,
    subject.match(/\(#(\d+)\)$/)?.[1] ?? "",
    "[PLACEHOLDER: classify contributor role]",
  ]);
}
writeFileSync(join(outputRoot, "CONTRIBUTION_HISTORY.csv"), csv(contributionRows));

const people = new Map();
for (const [, , name, email] of commits) {
  const key = name.toLowerCase().includes("ankur") ? "Ankur Kalita" : name.toLowerCase().includes("varun") ? "Varun Deep Saini" : name;
  const entry = people.get(key) ?? { commits: 0, names: new Set(), emails: new Set() };
  entry.commits += 1;
  entry.names.add(name);
  entry.emails.add(email);
  people.set(key, entry);
}

const summary = [
  "# Contribution inventory",
  "",
  "Baseline: Git history reachable from commit `8ee601c`.",
  "",
  "This inventory records authorship metadata. It does not infer academic ownership or the role of each contributor.",
  "",
  "| Canonical name | Commit count | Recorded identities | Role |",
  "| --- | ---: | --- | --- |",
  ...[...people.entries()].sort((a, b) => b[1].commits - a[1].commits).map(([name, entry]) =>
    `| ${name} | ${entry.commits} | ${[...entry.names].join(" / ")} | [PLACEHOLDER: student, teammate, external collaborator, or reviewer] |`,
  ),
  "",
  `The history contains ${commits.length} commits. Commit subjects identify ${commits.filter((row) => /\(#\d+\)$/.test(row[4])).length} pull-request-linked changes. The CSV retains every commit, author identity, subject, and linked pull-request number found in the subject.`,
  "",
  "Before submission, the student must classify each contributor and explain which work forms part of the assessed project.",
  "",
].join("\n");
writeFileSync(join(outputRoot, "CONTRIBUTION_SUMMARY.md"), summary);

console.log(`Wrote ${dependencyRows.length - 1} dependency rows and ${commits.length} contribution rows to ${outputRoot}`);
