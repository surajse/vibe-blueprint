#!/usr/bin/env node
// Fails when AI-facing files (AGENTS.md, rules, prompts, README) point at repo files that do not exist.
// This is the exact failure mode that makes AI agents hallucinate: instructions that reference ghosts.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const SCAN = [
  'AGENTS.md',
  'README.md',
  'CONTRIBUTING.md',
  '.cursor/rules',
  '.agents',
  'prompts',
  'docs',
];
// Files that are intentionally created later by a prompt (P0/P3/P8...), not part of the template.
const CREATED_LATER = new Set(['docs/discovery.md']);
const SKIP_FILE = new Set(['docs/BLUEPRINT.md']); // long-form playbook with illustrative trees
const REF =
  /(?:^|[\s`(\[@])((?:docs|prompts|scripts|\.github|\.cursor|\.agents)\/[A-Za-z0-9_./-]*\.(?:mdc|md|mjs|sh|yml|yaml|json)(?![A-Za-z0-9]))/g;

function* walk(p) {
  const abs = join(root, p);
  if (!existsSync(abs)) return;
  if (statSync(abs).isFile()) return yield p;
  for (const name of readdirSync(abs)) yield* walk(join(p, name));
}

const problems = [];
for (const entry of SCAN) {
  for (const file of walk(entry)) {
    if (!/\.(md|mdc)$/.test(file) || SKIP_FILE.has(file)) continue;
    const text = readFileSync(join(root, file), 'utf8');
    for (const m of text.matchAll(REF)) {
      const ref = m[1];
      if (/[*<>#]|xxx|\.{3}/i.test(ref) || CREATED_LATER.has(ref)) continue;
      if (!existsSync(join(root, ref))) problems.push(`${file}: references missing file "${ref}"`);
    }
  }
}

if (problems.length) {
  console.error('check-docs FAILED:\n' + [...new Set(problems)].map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log('check-docs OK');
