import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/prisma/client.js';

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const databaseUrl =
  process.env.DATABASE_URL ?? `file:${path.join(apiRoot, 'dev.db')}`;

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

const prisma = new PrismaClient({ adapter });

export default prisma;
