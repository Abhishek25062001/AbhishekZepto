# Auth Header Contract

## Authorization Header

Protected APIs use:

```text
Authorization: Bearer <accessToken>
```

## Frontend Behavior

When the backend returns:

- `401`: clear the current session or attempt refresh-token flow when that flow
  is implemented.
- `403`: show a permission denied state.

## Backend Authority

Frontend apps must not treat locally decoded tokens, hidden routes, or local
permission state as final authorization. Backend middleware is the final
authority.
