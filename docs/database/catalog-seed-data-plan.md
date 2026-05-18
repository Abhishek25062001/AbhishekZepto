# Catalog Seed Data Plan

Status: **PLANNED** — `seed-catalog.ts` created in catalog backend implementation, not in Catalog Architecture.

## Planned Seed File

```text
/backend/api/src/database/seeds/seed-catalog.ts
```

## Seed Categories (display names)

- Fruits & Vegetables
- Dairy, Bread & Eggs
- Atta, Rice, Oil & Dals
- Masala & Dry Fruits
- Packaged Food
- Beverages
- Personal Care
- Home Care
- Baby Care
- Pet Care

## Seed Units (`product_units.code`)

- `piece`
- `pack`
- `kg`
- `g`
- `litre`
- `ml`
- `dozen`

## Seed Tax Placeholders (`tax_categories.code`)

- `GST_0`
- `GST_5`
- `GST_12`
- `GST_18`
- `GST_28`

## Seed Rule

- Seeded catalog data must be **safe to re-run** without creating duplicates.
- Use stable unique keys: `categories.slug`, `product_units.code`, `tax_categories.code`.
- Integrate into main seed runner after `seed-roles` and dev users (see Phase 3 integration seed order in later modules).

## API Endpoints

No API endpoints created.

## DB Fields (idempotency keys)

- `categories.name`
- `categories.slug`
- `product_units.code`
- `tax_categories.code`
