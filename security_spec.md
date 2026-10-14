# MotoPilot Zero-Trust Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants
1. **Zero-Commission Financial Invariant**: No `PlatformOrder` document in `/orders/{orderId}` can be created or updated with `platformCommission != 0` or `courierEarnings != totalFare` or `serviceType == 'MOTO_PASSENGER_RIDE'` (M0 policy lock).
2. **PII Split-Collection Isolation**: User PII (`email`, `phone`) is stored exclusively in `/users_private/{userId}` and can only be read or written by the exact owner (`request.auth.uid == userId`) or a verified admin.
3. **Strict Ownership & Anti-Spoofing**: Every created document (`orders`, `batch_routes`, `wire_notices`) must have `ownerId == request.auth.uid` and `createdAt == request.time`.
4. **Terminal State Locking**: Once an order reaches `completed` or `cancelled`, non-admin users cannot mutate its status or fields.
5. **Query Enforcer (No Blanket Reads)**: `list` operations on `/orders`, `/batch_routes`, and `/wire_notices` require `resource.data.ownerId == request.auth.uid || isAdmin()`.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return `PERMISSION_DENIED`)
1. **Payload 01 (Shadow Field Injection)**: Creating `/orders/ord_1` with an undeclared field `"isAdminOverride": true`.
2. **Payload 02 (Non-Zero Commission Injection)**: Creating `/orders/ord_2` with `"platformCommission": 25`.
3. **Payload 03 (Locked Service Type Bypass)**: Creating `/orders/ord_3` with `"serviceType": "MOTO_PASSENGER_RIDE"`.
4. **Payload 04 (Identity Spoofing)**: Creating `/orders/ord_4` where `ownerId` does not match `request.auth.uid`.
5. **Payload 05 (Unverified Email Spoofing)**: Attempting a write or admin read when `request.auth.token.email_verified == false`.
6. **Payload 06 (PII Blanket Read)**: User A attempting `get(/users_private/user_B)`.
7. **Payload 07 (Unfiltered List Scraping)**: Executing an unconstrained `list` query on `/orders` without `where('ownerId', '==', uid)`.
8. **Payload 08 (Terminal State Re-opening)**: Updating an order with `existing().status == 'completed'` back to `'in_progress'`.
9. **Payload 09 (ID Poisoning / 1.5KB Key)**: Creating a document with a 500-character or special-character document ID.
10. **Payload 10 (Timestamp Forgery)**: Creating a document where `createdAt != request.time`.
11. **Payload 11 (Immortal Field Mutation)**: Updating `ownerId` or `createdAt` on an existing `/orders/{orderId}` document.
12. **Payload 12 (Self-Assigned Admin Escalation)**: Non-admin user attempting to write to `/admins/{uid}`.

## 3. Red Team Audit Matrix
- **Shadow Update Test**: PASS (`data.keys().hasAll(...) && data.keys().hasOnly(...)` + `affectedKeys().hasOnly(...)`).
- **Email Spoofing Test**: PASS (`isVerifiedUser()` enforces `request.auth.token.email_verified == true`).
- **PII Blanket Test**: PASS (`/users_private/{userId}` restricts `get` to `isOwner(userId) || isAdmin()`, `list` is `false`).
- **Query Trust Test**: PASS (`allow list` checks `resource.data.ownerId == request.auth.uid || isAdmin()`).
