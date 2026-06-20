#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import nextEnv from '@next/env';

const { loadEnvConfig } = nextEnv;

const command = process.argv[2];
const args = process.argv.slice(3);
const projectRoot = process.cwd();
const nextBin = path.resolve(projectRoot, 'node_modules/next/dist/bin/next');
const isDev = command === 'dev';

loadEnvConfig(projectRoot, isDev);

const child = spawn(process.execPath, [nextBin, command, ...args], {
  stdio: 'inherit',
  cwd: projectRoot,
  env: process.env,
});

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    child.kill(signal);
  });
}

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
