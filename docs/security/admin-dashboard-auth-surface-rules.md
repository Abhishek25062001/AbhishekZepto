# Admin Dashboard Auth Surface Rules

## Fixed Surface Rules

- Login requests from Admin Dashboard use the admin login role
- Verify requests must always send `appSurface = admin_dashboard`
- Admin Dashboard must accept only supported admin roles:
  `super_admin`, `support_admin`, `operations_admin`
- Bad role state or missing route state must redirect back to `/login`
