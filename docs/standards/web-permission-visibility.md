# Web Permission Visibility

## Scope

This standard applies to frontend permission visibility in the Vendor Panel and Admin Dashboard.

## Rule

- Frontend permission checks are only for hiding or showing UI.
- Backend authorization remains the final authority for every protected action and API request.
- `*:*` grants frontend visibility for all permission-gated UI.

## Examples

- `orders:read`
- `inventory:update`
- `settings:manage`
- `*:*`

## Component Pattern

- Use `hasPermission` for shared permission checks.
- Use `CanAccess` when rendering permission-gated UI fragments.
- Do not place API security decisions in React components.
