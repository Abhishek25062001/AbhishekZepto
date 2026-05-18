# Catalog Shared Contracts

Status: **PLANNED** — TypeScript files created in backend/frontend implementation modules, not in Catalog Architecture.

## Shared Package Location (planned)

```text
/packages/shared/api/catalog/
```

## Planned Type Files

| File | Purpose |
|------|---------|
| `catalog-category.types.ts` | Category list/detail DTOs |
| `catalog-brand.types.ts` | Brand DTOs |
| `catalog-product.types.ts` | Product DTOs |
| `catalog-variant.types.ts` | Variant DTOs |
| `catalog-filter.types.ts` | List filter query types |
| `catalog-media.types.ts` | Upload response types |
| `catalog-api.types.ts` | Shared enums, pagination wrappers |

## Export Surface (planned)

```text
/packages/shared/api/index.ts
```

Re-export catalog types for frontend API clients.

## Frontend Consumers

- Customer App — browse/search types
- Vendor Panel — read-only catalog types
- Admin Dashboard — CRUD and approval types

## API Endpoints

No API endpoints created. Types mirror planned contracts in:

- `docs/contracts/catalog-admin-api-contract.md`
- `docs/contracts/catalog-vendor-api-contract.md`
- `docs/contracts/catalog-customer-api-contract.md`

## DB Fields

No database fields created. Types align with schema docs under `docs/database/catalog-*`.
