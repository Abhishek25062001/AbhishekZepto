# Phase 4 Module Dependencies

## Gate Rule

**Module 0 (Foundation & Bootstrap) must be complete** before ticketizing or
implementing **Module 1 — Customer Location & Store Selection**.

## Module Dependency Table

| # | Module | Depends on | Blocks |
|---|--------|------------|--------|
| 0 | Foundation & Bootstrap | Phase 3 complete | Module 1+ |
| 1 | Customer Location & Store Selection | 0, Phase 3 Store Foundation, Phase 2 Customer auth | 2, 3, 6 |
| 2 | Customer Home & Shopping Entry | 1, Phase 3 Customer catalog read | 4, 13 |
| 3 | Cart Backend Foundation | 1, Phase 3 products/store-products/inventory | 4, 5, 6 |
| 4 | Customer App Cart Experience | 3 | 5, 7, 13 |
| 5 | Pricing & Cart Calculation | 3, 4 | 6, 7 |
| 6 | Checkout Preparation Backend | 3, 5, 1, Phase 3 inventory locks | 7, 8, 10 |
| 7 | Customer App Checkout Flow | 6, 4 | 8, 9 |
| 8 | Payment Gateway Foundation | 6 | 9, 10 |
| 9 | Customer App Payment Flow | 8, 7 | 10, 11 |
| 10 | Order Creation Backend | 8, 9, 6 | 11, 12 |
| 11 | Customer App Order Confirmation | 10, 9 | 12, 14 |
| 12 | Basic Customer Profile | Phase 2 auth, 1 (addresses link) | 14 |
| 13 | Customer App Search & Browsing Improvements | Phase 3 search, 4 | 14 |
| 14 | Phase 4 Testing & Validation | 1–13 | 15 |
| 15 | Phase 4 Integration & Review | 14 | Phase 5 Module 1 |

## Critical Chains

### Location → Commerce

```text
Module 1 (address + storeId)
  → Module 2 (home)
  → Module 3 (cart API)
  → Module 4 (cart UI)
```

### Cart → Checkout → Pay → Order

```text
Module 3 (cart)
  → Module 5 (pricing)
  → Module 6 (checkout + lock)
  → Module 7 (checkout UI)
  → Module 8 (payment API)
  → Module 9 (payment UI)
  → Module 10 (order API)
  → Module 11 (order UI)
```

### Phase 3 Dependencies (read-only)

| Phase 4 need | Phase 3 artifact |
|--------------|------------------|
| Browse products | Customer catalog search/read APIs |
| Store context | Store Foundation, service areas |
| Line item pricing | Store product mapping |
| Stock checks | Inventory stocks |
| Reservation | Inventory locking internal APIs |

## Phase Boundary

Phase 4 ends at **Module 15 Integration & Review**. Phase 5 begins with
**Order Lifecycle Architecture** (`AllPhase&Modules.pdf` page 58+).

Do not implement Phase 5 modules during Phase 4 tickets.
