import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, beforeEach } from 'vitest';
import prisma from '../src/db.js';

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

beforeAll(() => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL must be set for tests');
  }

  execSync(`pnpm exec prisma db push --url "${databaseUrl}"`, {
    cwd: apiRoot,
    env: process.env,
    stdio: 'pipe',
  });
});

beforeEach(async () => {
  await prisma.task.deleteMany();
});
