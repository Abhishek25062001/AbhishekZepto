# Media & File Upload API

Status: **IMPLEMENTED**

Canonical paths follow PDF Module 10 (`/api/v1/admin/media/*`, not `/api/v1/admin/catalog/media/*`).

## Admin (`/api/v1/admin/media`)

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| POST | `/upload` | `media:upload` | Multipart single upload (`file` field) |
| POST | `/bulk-upload` | `media:upload` | Multipart bulk upload (`files` field, max 10) |
| GET | `/files` | `media:read` | Paginated list with filters |
| GET | `/files/:mediaFileId` | `media:read` | Media file detail |
| GET | `/files/:mediaFileId/signed-url` | `media:read` | Signed or public URL |
| PATCH | `/files/:mediaFileId` | `media:update` | Update owner, purpose, visibility, metadata |
| DELETE | `/files/:mediaFileId` | `media:delete` | Soft delete + storage delete |

### Upload body (multipart fields)

`filePurpose` (required), optional `ownerType`, `ownerId`, `isPublic`, `metadata` (JSON string).

## Vendor (`/api/v1/vendor/media`)

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| POST | `/upload` | `media:upload` | Vendor-scoped upload |
| GET | `/files` | `media:read` | List files uploaded by current user |
| GET | `/files/:mediaFileId` | `media:read` | Detail with vendor scope check |
| DELETE | `/files/:mediaFileId` | `media:delete` | Delete with vendor scope check |

## Internal (`/api/v1/internal/media`)

Authentication: `authenticate()` (service JWT).

| Method | Path | Description |
|--------|------|-------------|
| POST | `/attach-owner` | Attach `ownerType` / `ownerId` to existing media file |
| GET | `/files/:mediaFileId` | Internal read by ID |

### Attach-owner body

`mediaFileId`, `ownerType`, `ownerId`, optional `filePurpose`.

## `media_files` collection

Fields: `ownerType`, `ownerId`, `uploadedBy`, `uploadedByRole`, `uploadedFromSurface`, `fileCategory`, `filePurpose`, `originalFileName`, `storedFileName`, `storageKey`, `publicUrl`, `signedUrl`, `mimeType`, `extension`, `sizeBytes`, `width`, `height`, `checksum`, `storageProvider`, `bucketName`, `folderPath`, `status`, `isPublic`, `isDeleted`, `deletedAt`, `deletedBy`, `metadata`, `createdAt`, `updatedAt`.

## Catalog integration

Category, brand, product, and variant create/update flows accept optional `*MediaFileId` fields and call internal attach-owner to populate URL fields (`iconUrl`, `bannerUrl`, `logoUrl`, `defaultImageUrl`, `imageUrl`).

## Audit

Audit metadata must not include raw file buffers, signed URL secrets, or AWS credentials.

## Deferred

- Production S3/GCS/CDN adapter hardening (placeholder env + factory only).
- HTTP route integration tests (optional Ticket 29 — covered by unit tests).
