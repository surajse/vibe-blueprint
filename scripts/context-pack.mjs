#!/usr/bin/env node
// context-pack.mjs: builds ONE paste-able context bundle from the repo's memory files,
// so any platform (Cursor, Lovable, Bolt, Replit, ChatGPT, Claude) starts a session with
// the same facts. Platforms without @-mentions can just paste the output.
// Usage: node scripts/context-pack.mjs [--task docs/tasks/T-012.md] [--budget 12000] [--out pack.md]
// Output is plain markdown on stdout (or --out). Token estimate = chars / 4 (rough).
// Zero dependencies. Node >= 20.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const budget = Number(opt('budget', 12000)); // tokens
const out = opt('out');

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8').trim() : null);
const sh = (cmd, a) => {
  try {
    return execFileSync(cmd, a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};

function detectTask() {
  const t = opt('task');
  if (t) return t;
  const m = sh('git', ['rev-parse', '--abbrev-ref', 'HEAD']).match(/T-(\d+)/i);
  return m ? `docs/tasks/T-${m[1]}.md` : null;
}

// Keep only the parts of PROGRESS.md the agent needs (state + gotchas), not the full history.
function slimProgress(md) {
  if (!md) return null;
  const keep = [
    'current state',
    'in progress',
    'working commands',
    'gotchas learned',
    'known issues',
  ];
  const parts = md
    .split(/^(?=## )/m)
    .filter((s) => keep.some((k) => s.toLowerCase().startsWith(`## ${k}`)));
  return parts.length ? parts.join('\n').trim() : md;
}

const task = detectTask();
const sections = [
  ['AGENTS.md (rules; read first)', read('AGENTS.md')],
  ['docs/PROGRESS.md (state + gotchas)', slimProgress(read('docs/PROGRESS.md'))],
  [`${task ?? 'current task'} (scope + acceptance criteria)`, task ? read(task) : null],
  ['docs/ARCHITECTURE.md (map)', read('docs/ARCHITECTURE.md')],
  ['git status', sh('git', ['status', '--short', '--branch']) || null],
  ['recent commits', sh('git', ['log', '--oneline', '-8']) || null],
];

let bundle =
  `# CONTEXT PACK (generated ${new Date().toISOString().slice(0, 10)})\n` +
  `Instruction: treat everything below as ground truth. If something you need is missing, say "I don't know, I need X". Do not guess.\n`;
const report = [];
for (const [title, body] of sections) {
  if (!body) {
    report.push(`  - MISSING: ${title}`);
    continue;
  }
  bundle += `\n---\n## ${title}\n\n${body}\n`;
  report.push(`  - ok (~${Math.ceil(body.length / 4)} tok): ${title}`);
}

const tokens = Math.ceil(bundle.length / 4);
if (!task)
  report.push(
    '  - WARN: no task detected. Use branch feat/T-012-name or --task docs/tasks/T-012.md',
  );
if (tokens > budget)
  report.push(
    `  - WARN: ~${tokens} tokens exceeds budget ${budget}. Trim ARCHITECTURE.md / PROGRESS.md (move old items to docs/archive/).`,
  );

if (out) writeFileSync(out, bundle);
else process.stdout.write(bundle);
console.error(`\ncontext-pack: ~${tokens} tokens\n${report.join('\n')}`);
