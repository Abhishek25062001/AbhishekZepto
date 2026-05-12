# Permission Code Format

## Format

Permission codes use:

```text
{resource}:{action}
```

## Wildcard Permission

The wildcard permission is:

```text
*:*
```

Any user with `*:*` is treated as having every permission by the backend
permission helpers.

## Examples

```text
orders:read
inventory:update
settings:manage
```

## Backend Authority

Frontend permission visibility is not a security boundary. Backend middleware
and services must enforce the final permission decision.
