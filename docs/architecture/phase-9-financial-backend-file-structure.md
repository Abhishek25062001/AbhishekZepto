# Phase 9 Financial Backend File Structure Plan

## Status

Planning document only. **Module 1 does not create these files.**

## Finance Root

```text
backend/api/src/modules/finance/
```

## Shared Finance Folders

```text
controllers/
routes/
services/
repositories/
models/
validators/
types/
constants/
utils/
webhooks/
```

## Payment Submodule (planned)

```text
finance/payments/models/payment-record.model.ts
finance/payments/repositories/payment-record.repository.ts
finance/payments/services/payment-record.service.ts
finance/payments/controllers/payment.controller.ts
finance/payments/routes/payment-customer.routes.ts
finance/payments/routes/payment-admin.routes.ts
finance/payments/validators/payment.validator.ts
finance/payments/types/payment.types.ts
```

## Refund Submodule (planned)

```text
finance/refunds/models/refund-record.model.ts
finance/refunds/repositories/refund-record.repository.ts
finance/refunds/services/refund.service.ts
finance/refunds/controllers/refund.controller.ts
finance/refunds/routes/refund-admin.routes.ts
finance/refunds/routes/refund-customer.routes.ts
finance/refunds/validators/refund.validator.ts
finance/refunds/types/refund.types.ts
```

## Settlement Submodule (planned)

```text
finance/settlements/models/vendor-settlement.model.ts
finance/settlements/repositories/vendor-settlement.repository.ts
finance/settlements/services/vendor-settlement.service.ts
finance/settlements/controllers/vendor-settlement.controller.ts
finance/settlements/routes/vendor-settlement-admin.routes.ts
finance/settlements/types/vendor-settlement.types.ts
```

## Earning Submodule (planned)

```text
finance/earnings/models/delivery-earning.model.ts
finance/earnings/repositories/delivery-earning.repository.ts
finance/earnings/services/delivery-earning.service.ts
finance/earnings/controllers/delivery-earning.controller.ts
finance/earnings/routes/delivery-earning-admin.routes.ts
finance/earnings/routes/delivery-earning-agent.routes.ts
finance/earnings/types/delivery-earning.types.ts
```

## Shared Finance Files (planned)

```text
finance/constants/finance-permissions.constant.ts
finance/constants/finance-error-codes.constant.ts
finance/constants/finance-audit-events.constant.ts
finance/utils/money.util.ts
finance/utils/payment-response.mapper.ts
finance/utils/refund-response.mapper.ts
finance/utils/finance-sanitizer.util.ts
```

## Existing Repo Alignment

Phase 4 implemented payment code lives at:

```text
backend/api/src/modules/payment/
```

Module 2+ must either:

1. Extend `modules/payment/` in place, or
2. Introduce `modules/finance/payments/` and migrate with explicit ticket scope

Module 1 does not choose migration strategy; Module 2 ticket must document the
chosen path before creating files.
