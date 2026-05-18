# Access Control Web Frontend Verification

## Automated Smoke Coverage (Ticket 15)

Run per app:

```bash
npm run test:access-control-smoke -w apps/vendor-panel
npm run test:access-control-smoke -w apps/admin-dashboard
```

Smoke tests cover pure `ProtectedRoute`, `CanAccess`, and `CanAccessAny` decisions:

- unauthenticated users redirect to login
- wrong roles or missing vendor scope redirect to login
- permission-gated controls hide when permission is missing
- admin `CanAccessAny` allows any matching permission (including wildcard)

## Vendor Panel

`NEEDS VERIFICATION` (live browser + backend):

- log in with seeded vendor account
- confirm protected entry requires vendor role and valid scope
- confirm header can refresh permissions
- confirm header can refresh sessions
- confirm logout-other-sessions works
- confirm protected vendor surface still rejects non-vendor sessions

## Admin Dashboard

`NEEDS VERIFICATION` (live browser + backend):

- log in with seeded admin account
- confirm protected entry requires admin role
- confirm header can refresh permissions
- confirm header can refresh sessions
- confirm logout-other-sessions works
- confirm admin protected surface rejects non-admin sessions

## Development Checks

- debug or auth-smoke surfaces remain development-only verification aids
- no auth page makes direct `axios` calls
