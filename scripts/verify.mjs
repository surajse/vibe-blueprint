#!/usr/bin/env node
// Cross-platform verify: format -> lint -> typecheck -> test -> build -> docs-check.
// Works on Windows, macOS, Linux (no bash needed).
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Preflight: wrong toolchain = confusing failures. Fail early and clearly.
const wantMajor = readFileSync(new URL('../.nvmrc', import.meta.url), 'utf8')
  .trim()
  .split('.')[0];
const haveMajor = process.versions.node.split('.')[0];
if (haveMajor !== wantMajor) {
  console.error(`WARN: Node ${process.versions.node}, repo expects major ${wantMajor} (.nvmrc).`);
}

const steps = ['check:docs', 'check:unicode', 'format:check', 'lint', 'typecheck', 'test', 'build'];

for (const script of steps) {
  console.log(`\n> pnpm ${script}`);
  const result = spawnSync('pnpm', [script], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.error) {
    console.error(`\nVERIFY FAILED (could not run pnpm): ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`\nVERIFY FAILED at: ${script}`);
    process.exit(result.status ?? 1);
  }
}
console.log('\nVERIFY OK');
