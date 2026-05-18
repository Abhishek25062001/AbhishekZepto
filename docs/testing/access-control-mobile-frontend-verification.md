# Access Control Mobile Frontend Verification

## Automated Smoke Coverage (Ticket 15)

Run per app:

```bash
npm run test:access-control-smoke -w apps/customer-app
npm run test:access-control-smoke -w apps/delivery-agent-app
```

Smoke tests cover pure auth-guard and session-restore decisions used by `AppNavigator`
and restore hooks:

- unauthenticated users remain on auth flow
- authenticated users reach protected main flow
- session restore shows splash until loading completes (no premature protected screen)
- partial stored sessions are rejected before auth restore

## Customer App

`NEEDS VERIFICATION` (live device/simulator + backend):

- log in with seeded customer account
- confirm auth lands in protected app flow
- confirm `ProfileScreen` can refresh permissions
- confirm session list can refresh
- confirm logout-other-sessions works without clearing current session
- confirm logout clears current session and returns to auth flow

## Delivery Agent App

`NEEDS VERIFICATION` (live device/simulator + backend):

- log in with seeded delivery-agent account
- confirm auth lands in protected app flow
- confirm `ProfileScreen` can refresh permissions
- confirm session list can refresh
- confirm logout-other-sessions works without clearing current session
- confirm logout clears current session and returns to auth flow

## Deny Behavior

- invalid or expired session should prevent protected use
- user-facing auth errors should appear as text
- no raw tokens should be displayed in normal auth surfaces
