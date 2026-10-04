#!/usr/bin/env node
// guard-diff.mjs: machine-enforces the rules an AI agent can silently break.
//   1. Scope fence    : changed files must match "Files allowed to touch" in the task file
//   2. Forbidden files: nothing listed under "Files forbidden" may change
//   3. Test tampering : existing test files may not be modified/deleted without a `spec-change:` trailer
//   4. New deps       : new dependency names in any package.json need a `deps-approved: <name>` trailer
//   5. Secrets files  : .env* may never change (except *.example)
// Usage: node scripts/guard-diff.mjs [--task docs/tasks/T-012.md] [--base origin/main] [--strict]
// Task is auto-detected from the branch name (feat/T-012-name) when --task is omitted.
// Zero dependencies. Node >= 20.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const strict = args.includes('--strict');
const git = (...a) =>
  execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// Always allowed because every task legitimately updates them.
const ALWAYS_ALLOWED = ['docs/PROGRESS.md', 'docs/decisions/**', 'docs/TASKS.md'];
const TEST_RE = /(^|\/)(__tests__|e2e|tests?)\/|\.(test|spec)\.[cm]?[jt]sx?$|\.maestro\//;
const ENV_RE = /(^|\/)\.env(\..+)?$/;
const MAX_FILES_WARN = 5;
const DEP_FILES_RE = /(^|\/)(package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml)$/;

function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        i++;
        if (glob[i + 1] === '/') {
          i++;
          re += '(?:.*/)?';
        } else re += '.*';
      } else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`);
}
const matchesAny = (file, globs) => globs.some((g) => globToRegExp(g).test(file));

function sectionBullets(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((l) => /^#{2,3}\s/.test(l) && l.toLowerCase().includes(heading));
  if (start < 0) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^#{1,3}\s/.test(lines[i])) break;
    const m = lines[i].match(/^\s*[-*]\s+`?([^`\s]+)`?/);
    if (m && m[1] !== '' && !/^\(?none\)?$/i.test(m[1])) out.push(m[1].replace(/^\.\//, ''));
  }
  return out;
}

function detectTask() {
  const explicit = opt('task');
  if (explicit) return explicit;
  let branch = '';
  try {
    branch = git('rev-parse', '--abbrev-ref', 'HEAD');
  } catch {
    /* detached HEAD in CI */
  }
  branch = branch || process.env.GITHUB_HEAD_REF || '';
  const m = branch.match(/T-(\d+)/i);
  return m ? `docs/tasks/T-${m[1]}.md` : null;
}

function depNames(jsonText) {
  if (!jsonText) return new Set();
  try {
    const j = JSON.parse(jsonText);
    return new Set(
      ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].flatMap((k) =>
        Object.keys(j[k] ?? {}),
      ),
    );
  } catch {
    return new Set();
  }
}

const base = opt('base', process.env.GUARD_BASE || 'origin/main');
let changed;
try {
  git('rev-parse', '--verify', base);
  changed = git('diff', '--name-status', '--find-renames', `${base}...HEAD`)
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      const p = l.split('\t');
      return { status: p[0][0], file: p[p.length - 1] };
    });
} catch (e) {
  console.error(
    `guard: cannot diff against "${base}". In CI use actions/checkout with fetch-depth: 0.`,
  );
  process.exit(2);
}
if (changed.length === 0) {
  console.log('guard: no changes vs', base);
  process.exit(0);
}

const messages = git('log', `${base}..HEAD`, '--format=%B');
const hasTrailer = (key) => new RegExp(`^${key}:`, 'im').test(messages);
const approvedDeps = new Set(
  [...messages.matchAll(/^deps-approved:\s*(.+)$/gim)]
    .flatMap((m) => m[1].split(/[,\s]+/))
    .filter(Boolean),
);

const violations = [];
const warnings = [];

// 5. Secrets files
for (const { file } of changed)
  if (ENV_RE.test(file) && !file.endsWith('.example'))
    violations.push(`SECRET FILE changed: ${file}`);

// 1+2. Scope fence
const taskPath = detectTask();
if (taskPath && existsSync(taskPath)) {
  const md = readFileSync(taskPath, 'utf8');
  const allowed = [...sectionBullets(md, 'files allowed'), ...ALWAYS_ALLOWED, taskPath];
  const forbidden = sectionBullets(md, 'files forbidden');
  if (sectionBullets(md, 'files allowed').length === 0)
    warnings.push(
      `${taskPath} has an empty "Files allowed to touch" list; scope fence cannot be checked.`,
    );
  else {
    for (const { file } of changed) {
      if (matchesAny(file, forbidden)) violations.push(`FORBIDDEN file touched: ${file}`);
      else if (!matchesAny(file, allowed) && !(approvedDeps.size > 0 && DEP_FILES_RE.test(file)))
        violations.push(`OUT OF SCOPE (not in ${taskPath}): ${file}`);
    }
  }
} else {
  warnings.push(
    taskPath
      ? `Task file ${taskPath} not found; scope fence skipped.`
      : 'No task detected (branch not named like feat/T-012-name); scope fence skipped.',
  );
}

// 3. Test tampering: modified (M) or deleted (D) pre-existing tests
const tampered = changed.filter(
  ({ status, file }) => (status === 'M' || status === 'D') && TEST_RE.test(file),
);
if (tampered.length && !hasTrailer('spec-change')) {
  for (const { status, file } of tampered)
    violations.push(
      `TEST ${status === 'D' ? 'DELETED' : 'EDITED'} without a "spec-change: <why>" commit trailer: ${file}`,
    );
}

// 4. New dependencies
for (const { status, file } of changed) {
  if (!/(^|\/)package\.json$/.test(file) || status === 'D') continue;
  let before = '';
  try {
    before = git('show', `${base}:${file}`);
  } catch {
    /* new file */
  }
  const added = [...depNames(readFileSync(file, 'utf8'))].filter((n) => !depNames(before).has(n));
  for (const n of added)
    if (!approvedDeps.has(n))
      violations.push(
        `NEW DEPENDENCY "${n}" in ${file} without a "deps-approved: ${n}" commit trailer (verify: npm view ${n})`,
      );
}

if (changed.length > MAX_FILES_WARN)
  warnings.push(
    `${changed.length} files changed (> ${MAX_FILES_WARN}). AGENTS.md says: stop and get approval for big changes.`,
  );

for (const w of warnings) console.warn(`WARN  ${w}`);
for (const v of violations) console.error(`FAIL  ${v}`);
if (violations.length || (strict && warnings.length)) {
  console.error(
    `\nguard: ${violations.length} violation(s). Fix the diff, or add the commit trailer if the change is intentional.`,
  );
  process.exit(1);
}
console.log(
  `guard OK: ${changed.length} file(s) checked${taskPath ? ` against ${taskPath}` : ''}.`,
);
