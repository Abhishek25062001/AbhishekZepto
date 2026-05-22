# Phase 4 Module 12 — Basic Customer Profile — Complete

**Date:** 2026-05-19

## Summary

Module 12 adds customer profile GET/PATCH APIs on `user_identities` and a production profile screen with editable name/email, read-only phone, and links to orders, addresses, and sessions.

## Backend module

`backend/api/src/modules/profile/`

| Method | Path |
|--------|------|
| GET | `/api/v1/customer/profile` |
| PATCH | `/api/v1/customer/profile` |

## Customer app module

`apps/customer-app/src/modules/profile/`

| Screen | Route |
|--------|-------|
| CustomerProfileScreen | `Profile` |

## Tests

```bash
npm run typecheck -w backend/api
npm run test:customer-profile -w backend/api
npm run typecheck -w apps/customer-app
npm run test:customer-profile -w apps/customer-app
```

## Known limitations

- Phone read-only
- No profile image upload
- Device smoke PENDING operator run

## Next

**Module 13 — Customer App Search & Browsing Improvements**
