#!/usr/bin/env node
// check-hidden-unicode.mjs: fails if AI instruction files contain invisible or bidirectional
// Unicode characters (a known way to hide instructions inside rules/prompt files).
// Scans: AGENTS.md, CLAUDE.md, .cursor/**, .agents/**, prompts/**, docs/**/*.md
// Usage: node scripts/check-hidden-unicode.mjs   (exit 1 on findings). Zero dependencies.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['AGENTS.md', 'CLAUDE.md', '.cursor', '.agents', 'prompts', 'docs'];
const EXT = /\.(md|mdc|json|ya?ml|txt)$/i;
// zero-width, bidi controls, BOM mid-file, tag characters, invisible separators
const BAD =
  /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF\u00AD\u180E]|[\u{E0000}-\u{E007F}]/u;

function* walk(p) {
  let s;
  try {
    s = statSync(p);
  } catch {
    return;
  }
  if (s.isDirectory()) {
    for (const n of readdirSync(p))
      if (n !== 'node_modules' && n !== '.git') yield* walk(join(p, n));
  } else if (EXT.test(p)) yield p;
}

let findings = 0;
for (const root of ROOTS) {
  for (const file of walk(root)) {
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .forEach((line, i) => {
        // a BOM at the very start of the file is harmless; ignore it on line 1
        const text = i === 0 ? line.replace(/^\uFEFF/, '') : line;
        const m = text.match(BAD);
        if (m) {
          findings++;
          const cp = m[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
          console.error(`FAIL  ${file}:${i + 1}  hidden character U+${cp}`);
        }
      });
  }
}
if (findings) {
  console.error(
    `\ncheck-hidden-unicode: ${findings} finding(s). Remove them: they can hide instructions from reviewers.`,
  );
  process.exit(1);
}
console.log('check-hidden-unicode OK');
