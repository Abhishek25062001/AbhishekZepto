# Backend Module Convention

Backend feature modules should use this folder pattern:

```text
modules/{module-name}/controllers
modules/{module-name}/services
modules/{module-name}/repositories
modules/{module-name}/models
modules/{module-name}/validators
modules/{module-name}/routes
modules/{module-name}/types
```

## Rule

Each module owns its domain logic. Cross-module shared logic should stay small,
explicit, and stable.

This document defines the folder convention only. It does not implement module
controllers, services, repositories, models, validators, routes, or types.
