# TFKS / MotoPilot repair notes

Base repo revision inspected: `c7b3c051452c8567325111a18e9f3f295a21a468`.

## Changes in this repair kit

1. CI uses the repository's committed `bun.lock` and runs the actual typecheck, test script, and build. The previous workflow used `actions/setup-node` with npm caching, failed because `package-lock.json` is missing, and never reached install/test/build.
2. The test script runs the existing platform tests plus eight real HTTP-level tests against an Express app instance. The existing platform test runner is also changed to continue after a failing group and report all group results instead of exiting on the first failure.
3. The API server no longer returns success-shaped order creation, state synchronization, vault transfer, or audit verification responses without authenticated identity, canonical persistence, and transaction semantics. These endpoints now return HTTP 503 with `BACKEND_NOT_CONFIGURED` until proper backend implementations exist.
4. The health endpoint reports process health separately from business API readiness. It no longer claims the ledger is balanced or audit chain valid merely because the process started.
5. JSON request body size is limited to 256 KiB; parser errors return sanitized JSON without stack traces.
6. `server.ts` exports `createApp()` so API routes can be exercised in tests without starting a permanent server or Vite frontend.

## Important limitation

These fixes fail closed; they do not replace the missing production backend. Before enabling business APIs, implement server-side Firebase ID-token verification (preferably Firebase Admin SDK), persistent Firestore/database transactions, role and resource authorization, durable idempotency, and append-only audit records. Then add emulator/integration tests that execute `firestore.rules` rather than merely describing test cases.

The GitHub integration used for this task returned `403 Resource not accessible by integration` when asked to create a branch. Therefore these files have not been committed to GitHub and no remote CI run can be triggered by this repair kit until someone with repository write access applies them.
