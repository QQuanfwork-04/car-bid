# CarBid Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the CarBid REST API (auth, paginated cars, offers/buy-now, Swagger) in `server/`.

**Architecture:** Express 5 app split into modules (auth, cars, offers). Each module has a zod schema file (validation + OpenAPI), a service (business logic, throws `AppError`), and a routes file (wires middleware, registers OpenAPI paths). MongoDB via Mongoose; concurrency on sale handled by an atomic conditional `findOneAndUpdate`.

**Tech Stack:** Node 22, Express 5, TypeScript, Mongoose 9, zod 4, @asteasolutions/zod-to-openapi 8, swagger-ui-express, bcrypt, jsonwebtoken, helmet, cors, vitest, supertest, mongodb-memory-server.

**Spec:** `docs/superpowers/specs/2026-11-26-carbid-backend-design.md`

## Global Constraints

- All code under `server/`; ESM (`"type": "module"`), strict TypeScript.
- Error shape: `{ error: { code, message, details? } }`. Codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `INVALID_CREDENTIALS`, `EMAIL_TAKEN`, `FORBIDDEN`, `NOT_FOUND`, `CAR_NOT_AVAILABLE`, `OFFER_EXISTS`, `OFFER_NOT_PENDING`, `INTERNAL_ERROR`.
- List shape: `{ data, pagination: { page, limit, total, totalPages } }`; `limit` 1–50, default 12.
- JSON output: `_id` → `id`, no `__v`, never `passwordHash`.
- `JWT_SECRET` ≥ 32 chars, required.
- Swagger UI at `/api/docs`, JSON at `/api/docs.json`, security scheme `bearerAuth`.

---

### Task 1: Scaffold + core middleware

**Files:** Create `server/package.json`, `tsconfig.json`, `vitest.config.ts`, `.env.example`, `.gitignore`, `src/config/env.ts`, `src/db.ts`, `src/app.ts`, `src/server.ts`, `src/middleware/error.ts`, `src/middleware/validate.ts`, `src/utils/pagination.ts`, `src/utils/toJSON.ts`, `src/docs/registry.ts`, `src/docs/openapi.ts`, `tests/setup.ts`, `tests/app.test.ts`.

**Produces:**
- `env` object `{ PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, CORS_ORIGIN, ENABLE_DOCS, NODE_ENV }`
- `class AppError(status: number, code: string, message: string, details?: unknown)`
- `validate({ body?, query?, params? })` middleware — parsed values stored on `req.body`, `res.locals.query`, `res.locals.params`
- `paginationQuery` zod schema, `paginate(model, filter, { page, limit, sort, populate? })` → `{ data, pagination }`
- `registry: OpenAPIRegistry`, `ErrorResponse`, `paginated(schema)` helper, `buildOpenApiDocument()`
- `createApp()` returning express app

- [ ] Test: `GET /api/health` → 200 `{ status: 'ok' }`; unknown route → 404 `NOT_FOUND`; `/api/docs.json` → openapi `3.1.0`.
- [ ] Implement, run `npm test`, commit.

### Task 2: Auth

**Files:** `src/modules/users/user.model.ts`, `src/modules/auth/{auth.schema,auth.service,auth.routes}.ts`, `src/middleware/auth.ts`, `tests/auth.test.ts`, `tests/helpers.ts`.

**Produces:** `User` model; `requireAuth` (sets `req.userId: string`); `signToken(userId)`; test helper `createUser(overrides?) → { user, token }`.

- [ ] Tests: register 201 + token, no passwordHash; duplicate → 409 EMAIL_TAKEN; short password → 400; login ok; wrong password / unknown email → 401 INVALID_CREDENTIALS; `/me` with token 200, without 401, bad token 401.
- [ ] Implement, run, commit.

### Task 3: Cars

**Files:** `src/modules/cars/{car.model,cars.schema,cars.service,cars.routes}.ts`, `tests/cars.test.ts`.

**Produces:** `Car` model; `rejectPendingOffers(carId)` lives in offers service (Task 4) — Task 3's withdraw calls `Offer.updateMany` directly via offer model created here as minimal? → **Decision:** create `offer.model.ts` in Task 3 so withdraw can reject pending offers.

- [ ] Tests: pagination (25 cars, limit 10 → 3 pages, page 4 → empty); filters make (case-insensitive)/bodyType/fuel/price range/year range; sort price_asc; q text search; only active listed; GET by id with seller; create requires auth + validation; PATCH only owner (403), not when sold (409); DELETE → withdrawn + pending offers rejected; `/me/cars`.
- [ ] Implement, run, commit.

### Task 4: Offers & buy now

**Files:** `src/modules/offers/{offers.schema,offers.service,offers.routes}.ts`, `tests/offers.test.ts`.

- [ ] Tests: create offer 201; own car 403; amount ≥ price 400; duplicate pending 409 OFFER_EXISTS; car sold 409; seller lists offers, non-seller 403; accept → car sold/buyer/soldPrice, other pending rejected; accept non-pending 409; reject; withdraw by buyer only; buy now → sold; buy own car 403; `/me/offers?role=seller|buyer`; concurrency: two buys via `Promise.all` → exactly one 200 and one 409; accept + buy concurrently → one wins.
- [ ] Implement, run, commit.

### Task 5: Swagger completeness, seed, docs

**Files:** `tests/docs.test.ts`, `src/scripts/seed.ts`, `server/README.md`, root `package.json` (script `server`).

- [ ] Test: docs.json contains every path from spec §5 with expected methods; `/api/docs/` returns HTML.
- [ ] Seed script per spec §10; run against a memory server smoke check.
- [ ] README; commit.
