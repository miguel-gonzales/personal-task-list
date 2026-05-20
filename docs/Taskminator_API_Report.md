# Taskminator MVP API — Implementation Report

**Version:** 1.2  
**Status:** MVP complete — 4 task endpoints + smoke route, covered by tests  
**Stack:** Node.js · Express 5 · TypeScript (ESM) · Prisma 7 · SQLite (`better-sqlite3` adapter)  
**Working directory:** `api/`

---

## Agent briefing

Spec-driven workflow: **read spec first, then code**.

| Doc | Role |
|-----|------|
| `docs/openapi.yaml` | API contract (source of truth for routes/shapes) |
| `docs/data-model.md` | Entity fields and soft-delete rules |
| `docs/user-stories.md` | Acceptance criteria |
| `docs/vision.md` | Product scope |

This report is the **implementation snapshot** — what exists today, how to run it, and what to build next. Do not treat embedded examples below as copy-paste source; use the files in `api/src/`.

---

## Project structure

```
personalTaskList/
├── docs/
│   ├── openapi.yaml          # Spec (not .yml)
│   ├── data-model.md
│   ├── user-stories.md
│   └── vision.md
└── api/
    ├── src/
    │   ├── index.ts          # Starts HTTP server
    │   ├── app.ts            # Express app (exported for tests)
    │   ├── db.ts             # Prisma singleton + SQLite URL
    │   ├── routes/tasks.ts   # All task endpoints
    │   ├── types/task.ts     # Request body types
    │   └── generated/prisma/ # Prisma client (generated, gitignored)
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    ├── tests/
    │   ├── setup.ts          # Pushes schema to test.db, clears tasks each test
    │   └── api/task.test.ts  # Supertest integration tests (11 cases)
    ├── prisma.config.ts      # Datasource URL for CLI
    ├── vitest.config.ts
    ├── tsconfig.json         # Build: src/ only
    └── tsconfig.test.json    # Typecheck: src + tests
```

**Not in repo (gitignored):** `api/dev.db`, `api/test.db`, `api/src/generated/prisma/`

---

## Data model

Matches `docs/data-model.md` and `prisma/schema.prisma`:

- `Task`: `id`, `title`, `status` (`todo` \| `done`), `created_at`, `updated_at`, `deleted_at?`
- Soft delete: `DELETE` sets `deleted_at`; list/update ignore deleted rows
- Optional client `id` on `POST` (UUID v4) for offline-first CLI

**Prisma notes:** Client generated to `src/generated/prisma` (`provider = "prisma-client"`). Runtime uses `@prisma/adapter-better-sqlite3`. DB URL: `process.env.DATABASE_URL` or default `file:<api>/dev.db` in `src/db.ts`.

---

## API reference

**Base URL:** `http://localhost:3000` (or `PORT`)

| Method | Path | Success | Notes |
|--------|------|---------|-------|
| `GET` | `/test` | `200 { "status": "ok" }` | Smoke check only (not in OpenAPI) |
| `GET` | `/tasks` | `200` Task[] | Active tasks, `created_at` asc |
| `POST` | `/tasks` | `201` Task | Body: `{ title, id? }` |
| `PATCH` | `/tasks/:id` | `200` Task | Body: `{ title?, status? }`, ≥1 field |
| `DELETE` | `/tasks/:id` | `204` | Soft delete |

**Errors:** `{ "error": "<message>" }`

| Situation | Status | Message (exact) |
|-----------|--------|-----------------|
| POST missing/blank title | 400 | `Title is required` |
| POST title > 280 chars | 400 | `Title must be less than 280 characters` |
| PATCH no fields | 400 | `At least one field must be provided` |
| PATCH empty title | 400 | `Title cannot be empty` |
| PATCH invalid status | 400 | `Status must be either "todo" or "done"` |
| PATCH/DELETE unknown or deleted id | 404 | `Task not found` |

**Behavior vs spec:** OpenAPI does not define error strings; above are implementation-defined. PATCH runs validation before 404, so `{}` on a missing id returns **400**, not 404.

---

## Tooling

| Script | Command |
|--------|---------|
| Dev server | `pnpm dev` → `tsx watch src/index.ts` |
| Build | `pnpm build` → `prisma generate && tsc` |
| Production | `pnpm start` → `node dist/index.js` |
| Tests | `pnpm test` → `vitest run` (uses `test.db`, not `dev.db`) |

**Package manager:** pnpm (see `package.json` `devEngines`).

**Migrations:** `pnpm exec prisma migrate dev` (schema changes). Tests use `prisma db push --url $DATABASE_URL` in `tests/setup.ts`.

---

## Tests

- **Framework:** Vitest + Supertest against `src/app.ts`
- **Isolation:** `vitest.config.ts` sets `DATABASE_URL=file:.../test.db`; `beforeEach` deletes all tasks
- **Coverage:** list, create, validation, patch, soft delete, 404s

Run from `api/`: `pnpm test`

---

## Key implementation decisions

| Decision | Reason |
|----------|--------|
| `app.ts` separate from `index.ts` | Supertest without binding a port |
| ESM + `.js` import extensions | `"type": "module"`, NodeNext resolution |
| Prisma adapter for SQLite | Prisma 7 driver adapter pattern |
| `tsconfig` includes only `src/` | Avoid `rootDir` clash with `tests/`; use `tsconfig.test.json` for tests |
| No committed SQLite files | Local/dev data stays out of git |

---

## Gaps / next steps (not built)

Aligned with product docs; implement against `openapi.yaml` when adding API surface.

1. **Error middleware** — global handler for unhandled errors (consistent 500 JSON)
2. **CLI** (`tm`) — `commander`, session map `~/.taskminator/session.json`, offline cache
3. **Web UI** — Next.js, terminal aesthetic
4. **Auth** — GitHub OAuth, `user_id` on `Task`, scoped queries
5. **Production DB** — Postgres; update `schema.prisma` + `prisma.config.ts` datasource
6. **OpenAPI sync** — add `/test` to spec or remove route; document 400/404 in spec if desired

---

## Quick setup

```bash
cd api
pnpm install
pnpm exec prisma migrate dev
pnpm dev          # API on :3000
pnpm test         # integration tests
```

---

*Last updated to match codebase as of MVP + test suite. Verify against `api/src/routes/tasks.ts` and `docs/openapi.yaml` before large changes.*
