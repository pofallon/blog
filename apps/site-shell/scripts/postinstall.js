import { existsSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';

const workspaceRoot = resolve(new URL('..', import.meta.url).pathname);
const require = createRequire(import.meta.url);
const styledJsxPkg = require.resolve('styled-jsx/package.json', { paths: [workspaceRoot] });
const styledJsxDir = dirname(styledJsxPkg);
const styledJsxNodeModules = join(styledJsxDir, 'node_modules');
const workspaceNodeModules = join(workspaceRoot, 'node_modules');

function ensureSymlink(dep) {
  const source = join(workspaceNodeModules, dep);
  const target = join(styledJsxNodeModules, dep);
  if (!existsSync(source)) {
    return;
  }
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
  }
  symlinkSync(source, target, 'dir');
}

if (existsSync(styledJsxDir) && existsSync(workspaceNodeModules)) {
  if (!existsSync(styledJsxNodeModules)) {
    mkdirSync(styledJsxNodeModules, { recursive: true });
  }
  ensureSymlink('react');
  ensureSymlink('react-dom');
}
