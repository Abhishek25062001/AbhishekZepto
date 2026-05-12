# API Filtering Format

## Filtering Goal

List endpoints must use predictable query parameters for filtering, search, pagination, and sorting.

## Query Filter Format

```text
GET /api/v1/admin/products?status=active&categoryId=xxx
```

## Search Query Format

```text
GET /api/v1/admin/products?search=milk
```

## Pagination Query Format

```text
GET /api/v1/admin/products?page=1&limit=20
```

## Sorting Query Format

```text
GET /api/v1/admin/products?sortBy=createdAt&sortOrder=desc
```

## Notes

- `page` starts at `1`.
- `limit` defaults to `20` unless an endpoint documents a stricter value.
- `sortOrder` must be `asc` or `desc`.
