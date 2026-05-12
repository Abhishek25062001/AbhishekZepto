# Monitoring Event Naming

## Purpose

This standard defines future monitoring event names. Phase 1 does not emit these
events to an external monitoring provider.

## Format

Future monitoring event names should use:

```text
surface.module.event_name
```

Rules:

- `surface` names the app or backend surface.
- `module` names the functional module.
- `event_name` uses lowercase snake_case.
- Names should describe failures or operational events clearly.

## Examples

```text
backend.auth.login_failed
customer_app.checkout.payment_failed
delivery_app.location.update_failed
vendor_panel.order.accept_failed
admin_dashboard.user.permission_denied
```

## API Endpoints

```text
GET /api/v1/public/health
GET /api/v1/public/system-info
```

## DB Fields

No new database fields are created by this task.
