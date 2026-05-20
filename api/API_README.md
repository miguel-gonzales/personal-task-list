# Taskminator API

**Taskminator** is a lightweight task API for developers who want a fast CLI and a synced web companion—minimal surface area, keyboard-first workflows, no heavyweight project management.

**Spec references:** [Data model](../docs/data-model.md) · [OpenAPI contract](../docs/openapi.yaml)

---

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** via [Corepack](https://nodejs.org/api/corepack.html) (matches `package.json` → pnpm 11.1.3)

Enable Corepack once on your machine:

```bash
corepack enable
```

From the repo root, enter the API package:

```bash
cd api
```

---

## Install

```bash
pnpm install
```

`postinstall` runs `prisma generate` automatically after install. That generates the Prisma client into `src/generated/prisma/` (required before `dev`, `build`, or `test`). If you change `prisma/schema.prisma`, run:

```bash
pnpm exec prisma generate
```

---

## Database

Apply migrations to create the local SQLite database (`dev.db`):

```bash
pnpm exec prisma migrate dev
```

The app uses `file:./dev.db` by default (see `prisma.config.ts`). Override with `DATABASE_URL` if needed.

---

## Run the API

**Development** (watch mode, restarts on file changes):

```bash
pnpm dev
```

Server listens on **http://localhost:3000** (override with `PORT`).

**Production build:**

```bash
pnpm build
pnpm start
```

---

## Try it

With the server running:

```bash
# Health-style check
curl http://localhost:3000/test

# List tasks
curl http://localhost:3000/tasks

# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship the feature"}'

# Mark done (use id from create response)
curl -X PATCH http://localhost:3000/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'

# Soft-delete
curl -X DELETE http://localhost:3000/tasks/<TASK_ID>
```

Request/response shapes and status codes are defined in the [OpenAPI contract](../docs/openapi.yaml).

---

## Tests

Integration tests use Vitest and Supertest against an isolated `test.db` (not `dev.db`):

```bash
pnpm test
```

---

## Optional

Inspect data with Prisma Studio:

```bash
pnpm exec prisma studio
```
