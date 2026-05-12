# Customer App Navigation Foundation

## Created Routes

```text
Auth/Login
Main/Home
Main/Profile
```

## Created Foundation

- Root `AppNavigator` using React Navigation.
- Auth stack with `LoginScreen`.
- Main stack with `HomeScreen` and `ProfileScreen`.
- Typed route lists in `navigation.types.ts`.
- Typed navigation helper in `useAppNavigation.ts`.
- Placeholder auth store value for routing until the state management ticket
  expands it.

## Pending Items

- Real OTP login actions will be implemented in Phase 2.
- Real session restore is handled by a later React Native Foundation ticket.
- Customer catalog, cart, checkout, and tracking screens are deferred to later
  feature modules.

