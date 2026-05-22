# Phase 4 Customer App File Structure

Status: **COMPLETE** — Phase 4 customer-app modules implemented through Module 12.

## Module Paths

```text
apps/customer-app/src/modules/
  addresses/
    api/
    hooks/
    screens/
    components/
    types/
  home/
    api/
    hooks/
    screens/
    components/
  cart/                    # IMPLEMENTED Module 4
    api/
    hooks/
    screens/
    components/
    store/
  checkout/                 # IMPLEMENTED Module 7
    api/
    hooks/
    screens/
    components/
    types/
    utils/
  payment/                 # IMPLEMENTED Module 9
    api/
    hooks/
    services/
    components/
    types/
    utils/
  orders/                  # IMPLEMENTED Module 11
    api/
    hooks/
    screens/
    components/
    types/
    utils/
  profile/                 # IMPLEMENTED Module 12
    api/
    hooks/
    screens/
    components/
    types/
    utils/
```

## Navigation (planned)

| Screen | Route name |
|--------|------------|
| AddressList | `AddressList` |
| AddressForm | `AddressForm` |
| Home | `Home` |
| Cart | `Cart` |
| Checkout | `Checkout` |
| Payment | embedded Razorpay |
| OrderSuccess | `OrderSuccess` |
| OrderDetail | `OrderDetail` |
| OrderHistory | `OrderHistory` |
| Profile | `Profile` |

## Razorpay

Integrate in Module 9 under `modules/payment/services/razorpay-checkout.ts`.

## Module 0 Rule

No new screens or hooks until Module 1+ customer-app tickets.
