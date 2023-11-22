#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { join } from 'path';

export function resolveImportMeta(path) {
  if (!import.meta.resolve)
    throw new Error(`import.meta.resolve is not a function.
       Please use NODE_OPTIONS=--experimental-import-meta-resolve env`);

  return fileURLToPath(import.meta.resolve(path));
}

export const vitePluginConfig = {
  get eslintPath() {
    return resolveImportMeta('../config/eslint4vite.js');
  },
  fix: process.stdin.isTTY,
};

if (process.argv[1].endsWith('nextlab-eslint') || process.argv[1] === fileURLToPath(import.meta.url)) {
  const eslintPath = join(resolveImportMeta('eslint'), '../../bin/eslint.js');
  const configPath = resolveImportMeta('../eslint.config.js');
  process.argv.push('-c', configPath);

  console.log({ configPath, eslintPath });
  await import(eslintPath);
} else
  console.log(process.argv);
