# Auth Role Model

## Roles

- `customer`
- `delivery_agent`
- `vendor_owner`
- `store_manager`
- `store_staff`
- `support_admin`
- `operations_admin`
- `super_admin`

## Permission Group Placeholders

- `auth`
- `users`
- `catalog`
- `inventory`
- `orders`
- `delivery`
- `payments`
- `refunds`
- `support`
- `settings`
- `audit_logs`

## Backend Authority

The backend owns role checks, permission checks, and tenant or store scope
checks. Frontend role-aware UI is only a convenience layer.
