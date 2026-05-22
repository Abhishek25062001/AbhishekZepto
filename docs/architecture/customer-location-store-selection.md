# Customer Location & Store Selection

## Module

Phase 4 Module 1 — Customer Location & Store Selection.

## Goal

Enable customers to save delivery addresses, resolve the nearest serviceable dark store,
and persist store selection for catalog browsing (Module 2+).

## Customer Flow

```text
OTP login
  → Address list (or add first address)
  → Serviceability check (coordinates)
  → Confirm store selection
  → Catalog / home uses selectedStoreId + cityId
```

## PDF Alignment

| PDF | Repository |
|-----|------------|
| `customer/locations` | `/api/v1/customer/addresses` |
| `locationId` | `addressId` |
| `GET/POST store-selection` | `POST /serviceability` + `POST /store-selection` |

## Serviceability Algorithm

1. Load stores where `status=active`, `isDeleted=false`, `isOpen=true`, `isAcceptingOrders=true`.
2. Optional filter by `address.cityId` when set.
3. Haversine distance (km) from address to `store.latitude/longitude`.
4. Keep stores where `distance <= store.serviceRadiusKm`.
5. Return nearest by distance; if none → `SERVICEABILITY_AREA_UNAVAILABLE`.

## App State

`apps/customer-app/src/modules/addresses/store/location.store.ts`:

- `selectedAddressId`
- `selectedStoreId`
- `cityId`
- Persisted via AsyncStorage (`SELECTED_ADDRESS_ID`, `SELECTED_STORE_ID`)

## API Endpoints

See `docs/contracts/customer-address-api.md`, `docs/contracts/customer-app-location-ui-contract.md`.

## DB Collections

- `customer_addresses` — `docs/database/customer-address-schema.md`
- `customer_store_selections` — `docs/database/customer-store-selection-schema.md`

## Out of Scope

- Geocoding / maps SDK
- Admin store-selection routes (PDF only)
- Home feed (Module 2)

## Related

- `docs/architecture/phase-4-customer-shopping-architecture.md`
- Phase 3 `stores` model (`serviceRadiusKm`, coordinates)
