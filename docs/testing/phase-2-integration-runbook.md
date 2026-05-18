# Phase 2 Integration Runbook

Manual live verification after Ticket 18 static closeout. Automated checks below
should pass locally before running this runbook.

## 0. Automated Pre-Check (local, no server)

```bash
npm run typecheck -w packages/shared
npm run typecheck -w backend/api && npm run lint -w backend/api && npm run build -w backend/api
npm run test:services -w backend/api
npm run test:controllers -w backend/api
npm run test:tenant-scope -w backend/api
npm run test:tenant-access -w backend/api
npm run test:session-admin -w backend/api
npm run test:access-control-harness -w backend/api
npm run test:access-control-scenarios -w backend/api
npm run validate:postman:phase-2-access-control
npm run validate:postman:phase-2-verification
npm run typecheck -w apps/customer-app
npm run typecheck -w apps/delivery-agent-app
npm run typecheck -w apps/vendor-panel
npm run typecheck -w apps/admin-dashboard
npm run test:access-control-smoke -w apps/customer-app
npm run test:access-control-smoke -w apps/delivery-agent-app
npm run test:access-control-smoke -w apps/vendor-panel
npm run test:access-control-smoke -w apps/admin-dashboard
```

## 1. Backend Startup

- start MongoDB
- run seeds: `npm run seed -w backend/api`
- start backend: `npm run dev:backend`
- confirm `GET {{baseUrl}}/api/v1/public/health` returns success

## 2. Public Auth Flow Checks

- request OTP
- verify OTP
- refresh token
- logout (run last in verification collection)

Use:

- `docs/contracts/postman/phase-2-verification.postman_collection.json`
- `docs/setup/dev-auth-users.md`

## 3. Access-Control Allow/Deny Pass

Use:

- `docs/contracts/postman/phase-2-access-control.postman_collection.json`
- `docs/testing/access-control-backend-happy-path.md`
- `docs/testing/access-control-backend-deny-path.md`

## 4. Per-Surface Checks

- Customer App
- Delivery Agent App
- Vendor Panel
- Admin Dashboard

Use:

- `docs/testing/access-control-mobile-frontend-verification.md`
- `docs/testing/access-control-web-frontend-verification.md`

## 5. Admin RBAC And Sessions

- role list/get (admin token)
- user session list/revoke (admin token)
- deny paths with customer token

## 6. Audit And Security Checks

Use:

- `docs/testing/access-control-audit-verification.md`
- `docs/security/phase-2-security-audit-review.md`

Confirm audit rows persist when MongoDB is running.

## 7. Final Code-Quality Pass

Use:

- `docs/testing/phase-2-code-quality-and-gaps.md`
- `npm run check:secrets`
- `npm run check:frontend-secrets`

## Closeout Reference

- `docs/handoffs/phase-2-release-notes.md`
- `docs/reviews/phase-1-2-completion-verification.md`
