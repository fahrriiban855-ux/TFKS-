# TFKS / MotoPilot repair kit

This kit targets GitHub `main` commit:
`c7b3c051452c8567325111a18e9f3f295a21a468`

## Apply

1. Download/unzip this kit.
2. In a clean local checkout of `fahrriiban855-ux/TFKS-`, run:

   ```bash
   python3 /path/to/tfks-repair-kit/apply_patch.py /path/to/TFKS-
   ```

3. Review `git diff` before committing.
4. Run:

   ```bash
   bun install --frozen-lockfile
   bun run lint
   bun run test
   bun run build
   ```

5. Commit on a dedicated branch and open a pull request. Do not merge until the CI run passes.

The installer refuses a dirty working tree or an unexpected base commit by default, and creates a backup of replaced files outside the repository.

## What it does

- Fixes CI so it uses the checked-in `bun.lock`, not npm cache without `package-lock.json`.
- Runs the project's TypeScript check, unit tests, API safety tests and production build.
- Adds HTTP-level tests for API readiness, oversized/malformed JSON and fail-closed business endpoints.
- Makes the original platform test runner report all eight test groups instead of exiting after the first failed group.
- Prevents Express endpoints from returning fake success for state writes, order creation, cash transfers and audit verification before authentication and persistent transactional storage exist.
- Makes health checks distinguish process availability from business backend readiness.

## Scope limitation

This is a safe partial repair, not a production backend implementation. Business endpoints deliberately return `503 BACKEND_NOT_CONFIGURED`. Proper server-side Firebase ID-token verification, durable storage and transactions, server-side role/resource checks, durable idempotency and real Firestore Emulator security tests are still required before enabling them.

GitHub rejected the attempt to create a branch with `403 Resource not accessible by integration`; these changes have **not** been committed to the remote repository.
