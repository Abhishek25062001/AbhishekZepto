# Phase 3 Media & File Upload Foundation — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Media & File Upload Foundation  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 176–202  

**Architecture references:**  
`docs/architecture/catalog-media-architecture.md`, `project-context/DATABASE_STANDARDS.md`, `docs/contracts/role-permission-contract.md`, `docs/security/audit-log-fields.md`, `docs/standards/api-conventions.md`, `docs/errors/catalog-error-codes.md` (media codes planned)

**Prerequisites (already in repo):**  
Phase 2 auth/RBAC/tenant scope; Catalog modules (category, brand, product, variant) with URL fields; Inventory Locking Preparation complete; route groups at `/api/v1/admin`, `/api/v1/vendor`, `/api/v1/internal`.

**API path note:** PDF Module 10 uses `/api/v1/admin/media/*`, `/api/v1/vendor/media/*`, `/api/v1/internal/media/*` — **not** `/api/v1/admin/catalog/media/*` from Catalog Architecture planning doc. Implement PDF paths; update `catalog-media-architecture.md` status in Ticket 27 only.

**Out of scope for this module:**  
Admin Dashboard — Catalog Foundation (frontend), Customer/Delivery media UIs, full production S3/GCS/CDN rollout (placeholder adapter + env only), `packages/shared` TypeScript files, Repository & Codebase Setup, Order/Support runtime modules, image processing library (store `width`/`height` only when available from upload metadata).

**Execution order notes:**
- Run **Ticket 16** (permissions/errors global) before **Tickets 20–22** (routes/mount).
- Run **Ticket 10** (repository) before **Tickets 14–15** (media file service).
- Run **Tickets 8–9** (storage adapters + env) before **Ticket 14** (upload).
- Run **Ticket 11** (upload middleware) before route tickets that accept multipart.
- Run **Tickets 17–19** (controllers) before **Tickets 20–22** (route files).
- Run **Ticket 24** (catalog integration) after **Ticket 15** (`attachMediaOwner`) and catalog modules exist.
- Use co-located `*.test.ts` files (repo convention), not PDF `__tests__/` paths.

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE`

---

## Ticket 1 — Media file schema and foundation docs

**Ticket:** 1 — Media file schema and foundation docs

**Objective:** Add planning docs for `media_files` collection and upload behavior (no runtime code).

**Files to create/update:**
- `docs/database/media-file-schema.md` (create)
- `docs/validation/media-upload-validation-rules.md` (create)
- `docs/security/media-upload-permissions.md` (create)
- `docs/errors/media-upload-error-codes.md` (create)

**API endpoints:** Document planned admin, vendor, and internal routes only.

**DB fields:** Document all `media_files.*` fields from PDF pages 177–178: `ownerType`, `ownerId`, `uploadedBy`, `uploadedByRole`, `uploadedFromSurface`, `fileCategory`, `filePurpose`, `originalFileName`, `storedFileName`, `storageKey`, `publicUrl`, `signedUrl`, `mimeType`, `extension`, `sizeBytes`, `width`, `height`, `checksum`, `storageProvider`, `bucketName`, `folderPath`, `status`, `isPublic`, `isDeleted`, `deletedAt`, `deletedBy`, `metadata`, `createdAt`, `updatedAt`. Document catalog entity URL fields updated via integration: `categories.iconUrl`, `categories.bannerUrl`, `brands.logoUrl`, `brands.bannerUrl`, `products.defaultImageUrl`, `products.imageUrls[]`, `product_variants.imageUrl`.

**Implementation steps:**
1. Enums: `ownerType`, `fileCategory`, `filePurpose`, `storageProvider`, `status` per PDF.
2. Indexes: partial unique `{ storageKey: 1 }` where `isDeleted: false`; indexes on `ownerType`, `ownerId`, `uploadedBy`, `fileCategory`, `filePurpose`, `status`, `isPublic`, `isDeleted`, `createdAt`; index on `checksum`.
3. Upload limits defaults: image 5MB, document 10MB, video 50MB, max 10 files per request.
4. Allowed/blocked MIME types per PDF pages 179–180.
5. Permissions: `media:read`, `media:upload`, `media:update`, `media:delete` (PDF page 192).

**Acceptance criteria:**
- Docs match PDF micro-tasks; no Mongoose or route files created.

**Test commands:**
- `test -f docs/database/media-file-schema.md && test -f docs/errors/media-upload-error-codes.md && echo PASS`

**Depends on:** Inventory Locking Preparation complete.

---

## Ticket 2 — Media module scaffold and enum constants

**Ticket:** 2 — Media module scaffold and enum constants

**Objective:** Create `media/` folder layout and core enum constant files.

**Files to create/update:**
- `backend/api/src/modules/media/` — `controllers/`, `routes/`, `services/`, `repositories/`, `models/`, `validators/`, `types/`, `constants/`, `utils/`, `storage/`, `middlewares/`
- `backend/api/src/modules/media/constants/media-owner-type.constant.ts`
- `backend/api/src/modules/media/constants/media-file-category.constant.ts`
- `backend/api/src/modules/media/constants/media-file-purpose.constant.ts`
- `backend/api/src/modules/media/constants/media-status.constant.ts`
- `backend/api/src/modules/media/constants/storage-provider.constant.ts`

**API endpoints:** None.

**DB fields:** Constants only.

**Implementation steps:**
1. `ownerType`: `category`, `brand`, `product`, `product_variant`, `store`, `user`, `vendor`, `delivery_agent`, `order`, `support_ticket`, `system`.
2. `fileCategory`: `image`, `document`, `video`, `audio`, `other`.
3. `filePurpose`: `category_icon`, `category_banner`, `brand_logo`, `brand_banner`, `product_main_image`, `product_gallery_image`, `variant_image`, `store_logo`, `store_banner`, `profile_image`, `order_proof`, `support_attachment`, `document_upload`, `general`.
4. `storageProvider`: `local`, `s3`, `gcs`, `cloudinary`.
5. `status`: `uploaded`, `processing`, `active`, `failed`, `deleted`, `archived`.

**Acceptance criteria:**
- Folder tree exists; no models, routes, or services yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 1.

---

## Ticket 3 — Media error codes, audit events, limits, and MIME constants

**Ticket:** 3 — Media error codes, audit events, limits, and MIME constants

**Objective:** Error, audit, upload limit, and allowed/blocked MIME constant files.

**Files to create/update:**
- `backend/api/src/modules/media/constants/media-error-codes.constant.ts`
- `backend/api/src/modules/media/constants/media-audit-events.constant.ts`
- `backend/api/src/modules/media/constants/media-upload-limits.constant.ts`
- `backend/api/src/modules/media/constants/allowed-mime-types.constant.ts`

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Error codes per PDF page 192: `MEDIA_FILE_NOT_FOUND`, `MEDIA_UPLOAD_FAILED`, `MEDIA_DELETE_FAILED`, `MEDIA_INVALID_MIME_TYPE`, `MEDIA_INVALID_EXTENSION`, `MEDIA_FILE_TOO_LARGE`, `MEDIA_FILE_EMPTY`, `MEDIA_FILE_COUNT_EXCEEDED`, `MEDIA_STORAGE_PROVIDER_INVALID`, `MEDIA_ACCESS_DENIED`, `MEDIA_OWNER_INVALID`, `MEDIA_SIGNED_URL_FAILED`.
2. Audit events per PDF pages 192–193: `media.file_uploaded`, `media.files_bulk_uploaded`, `media.file_updated`, `media.file_deleted`, `media.owner_attached`, `media.signed_url_generated`.
3. Limits: `imageMaxSizeBytes=5242880`, `documentMaxSizeBytes=10485760`, `videoMaxSizeBytes=52428800`, `maxFilesPerRequest=10`.
4. Allowed image: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`; document: `application/pdf`, `image/jpeg`, `image/png`.
5. Blocked: `image/svg+xml`, `text/html`, `application/javascript`, `application/x-msdownload`, `application/x-sh`.

**Acceptance criteria:**
- Constants compile; map to docs from Ticket 1.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 4 — Media file Mongoose model and indexes

**Ticket:** 4 — Media file Mongoose model and indexes

**Objective:** Implement `MediaFileModel` for collection `media_files`.

**Files to create/update:**
- `backend/api/src/modules/media/models/media-file.model.ts`
- `backend/api/src/database/constants/collection-names.constants.ts` — add `MEDIA_FILES: 'media_files'`

**API endpoints:** None.

**DB fields:** All fields from Ticket 1 on `media_files`.

**Implementation steps:**
1. Partial unique index: `{ storageKey: 1 }` where `isDeleted: false`.
2. Indexes: `ownerType`, `ownerId`, `uploadedBy`, `fileCategory`, `filePurpose`, `status`, `isPublic`, `isDeleted`, `createdAt`, `checksum`.
3. Soft-delete fields: `isDeleted`, `deletedAt`, `deletedBy`.

**Acceptance criteria:**
- Model compiles; enums match Ticket 2.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 5 — Media file and storage adapter TypeScript types

**Ticket:** 5 — Media file and storage adapter TypeScript types

**Objective:** TypeScript contracts for media records and storage adapters.

**Files to create/update:**
- `backend/api/src/modules/media/types/media-file.types.ts`
- `backend/api/src/modules/media/types/storage-adapter.types.ts`

**API endpoints:** None.

**DB fields:** Types: `MediaOwnerType`, `MediaFileCategory`, `MediaFilePurpose`, `StorageProvider`, `MediaStatus`, `MediaFileDocument`, `UploadMediaInput`, `UpdateMediaInput`, `MediaListQuery`, `DeleteMediaInput`, `AttachMediaOwnerInput`, `BulkUploadSummary`.

**Implementation steps:**
1. Storage adapter interface methods per PDF page 179: `uploadFile()`, `deleteFile()`, `getPublicUrl()`, `getSignedUrl()`, `fileExists()`.
2. List query supports filters: `ownerType`, `ownerId`, `uploadedBy`, `fileCategory`, `filePurpose`, `status`, `isPublic`, `search`, pagination, sort.

**Acceptance criteria:**
- Types compile; no service implementation.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 4.

---

## Ticket 6 — Media utility helpers

**Ticket:** 6 — Media utility helpers

**Objective:** File naming, storage key, category detection, and checksum utilities.

**Files to create/update:**
- `backend/api/src/modules/media/utils/media-file-name.util.ts`
- `backend/api/src/modules/media/utils/media-storage-key.util.ts`
- `backend/api/src/modules/media/utils/media-category.util.ts`
- `backend/api/src/modules/media/utils/media-checksum.util.ts`

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `sanitizeOriginalFileName()`, `generateStoredFileName()` → `timestamp_random-safe-id.extension`.
2. `buildStorageKey(filePurpose, ownerType, ownerId, storedFileName)` with folders: `catalog/categories`, `catalog/brands`, `catalog/products`, `catalog/variants`, `stores`, `users`, `orders`, `support`, `general`.
3. `detectFileCategory(mimeType)`: image/* → image, `application/pdf` → document, video/* → video, audio/* → audio.
4. `generateFileChecksum(buffer)` SHA-256.

**Acceptance criteria:**
- Pure utils; unit-testable.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 5.

---

## Ticket 7 — Media file response mapper

**Ticket:** 7 — Media file response mapper

**Objective:** Map DB documents to API DTOs; exclude internal fields per PDF page 181.

**Files to create/update:**
- `backend/api/src/modules/media/utils/media-response.mapper.ts`

**API endpoints:** None.

**DB fields:** Response includes: `id`, `ownerType`, `ownerId`, `fileCategory`, `filePurpose`, `originalFileName`, `publicUrl`, `signedUrl`, `mimeType`, `extension`, `sizeBytes`, `width`, `height`, `storageProvider`, `status`, `isPublic`, `metadata`, `createdAt`, `updatedAt`. Exclude: `storageKey`, `bucketName`, `folderPath`, `checksum`, `isDeleted`, `deletedAt`, `deletedBy`, `uploadedBy`, `__v`.

**Implementation steps:**
1. Mirror inventory lock response mapper pattern.

**Acceptance criteria:**
- Mapper compiles.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 5.

---

## Ticket 8 — Local storage adapter

**Ticket:** 8 — Local storage adapter

**Objective:** Local filesystem storage for development.

**Files to create/update:**
- `backend/api/src/modules/media/storage/local-storage.adapter.ts`

**API endpoints:** None.

**DB fields:** Writes files under `MEDIA_LOCAL_UPLOAD_DIR`; `storageProvider: local`.

**Implementation steps:**
1. Implement all `StorageAdapter` methods for local dev.
2. `getSignedUrl()` returns public URL fallback for local storage.
3. `fileExists()` checks disk path from `storageKey`.

**Acceptance criteria:**
- Adapter compiles; no factory yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 5.

---

## Ticket 9 — S3 storage placeholder, adapter factory, and env configuration

**Ticket:** 9 — S3 storage placeholder, adapter factory, and env configuration

**Objective:** Storage factory + env vars; S3 placeholder with production TODO.

**Files to create/update:**
- `backend/api/src/modules/media/storage/s3-storage.adapter.ts` (placeholder)
- `backend/api/src/modules/media/storage/storage-adapter.factory.ts`
- `backend/api/.env.example`
- `backend/api/src/config/env.ts`

**API endpoints:** None.

**DB fields:** `storageProvider`, `bucketName` from env when S3 selected.

**Implementation steps:**
1. Factory returns adapter from `MEDIA_STORAGE_PROVIDER` (`local` | `s3` | …).
2. Env vars per PDF page 183: `MEDIA_STORAGE_PROVIDER`, `MEDIA_LOCAL_UPLOAD_DIR`, `MEDIA_PUBLIC_BASE_URL`, `MEDIA_MAX_IMAGE_SIZE_BYTES`, `MEDIA_MAX_DOCUMENT_SIZE_BYTES`, `MEDIA_MAX_VIDEO_SIZE_BYTES`, `MEDIA_ALLOWED_IMAGE_MIME_TYPES`, `MEDIA_ALLOWED_DOCUMENT_MIME_TYPES`, `MEDIA_MAX_FILES_PER_REQUEST`, `AWS_S3_BUCKET`, `AWS_S3_REGION`, `AWS_S3_ACCESS_KEY_ID`, `AWS_S3_SECRET_ACCESS_KEY`, `AWS_S3_PUBLIC_BASE_URL`.
3. Production rule: block `MEDIA_STORAGE_PROVIDER=local` when `APP_ENV=production`.
4. S3 adapter: placeholder `uploadFile`/`deleteFile` with TODO for production finalization.

**Acceptance criteria:**
- Env validates; factory returns local adapter in dev defaults.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 3, 8.

---

## Ticket 10 — Media file repository

**Ticket:** 10 — Media file repository

**Objective:** Data access layer for `media_files`.

**Files to create/update:**
- `backend/api/src/modules/media/repositories/media-file.repository.ts`

**API endpoints:** None.

**DB fields:** CRUD on all `media_files` fields.

**Implementation steps:**
1. Methods per PDF pages 183–184: `createMediaFile`, `findMediaFileById`, `findMediaFileByStorageKey`, `updateMediaFileById`, `softDeleteMediaFileById`, `listMediaFiles` (filters from Ticket 5), `countMediaFilesByOwner`.
2. Exclude soft-deleted by default on find/list.

**Acceptance criteria:**
- No service or route code.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 4.

---

## Ticket 11 — Multipart upload middleware

**Ticket:** 11 — Multipart upload middleware

**Objective:** Multer (or existing upload package) middleware for single and bulk uploads.

**Files to create/update:**
- `backend/api/src/modules/media/middlewares/upload.middleware.ts`
- `backend/api/package.json` — add `multer` dependency if not present

**API endpoints:** Middleware for multipart on upload routes.

**DB fields:** None.

**Implementation steps:**
1. Single file field `file` for `POST .../upload`.
2. Multi file field `files` for `POST .../bulk-upload`.
3. Enforce `MEDIA_MAX_FILES_PER_REQUEST`.
4. Enforce per-category size limits from env/constants.
5. Reject blocked MIME types before storage (early filter when possible).

**Acceptance criteria:**
- Middleware exports `singleUpload` and `bulkUpload` handlers.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 3, 9.

---

## Ticket 12 — Media upload Zod validators

**Ticket:** 12 — Media upload Zod validators

**Objective:** Request validation for all media endpoints.

**Files to create/update:**
- `backend/api/src/modules/media/validators/media-upload.validator.ts`

**API endpoints:** Validators for:
- `POST /api/v1/admin/media/upload`
- `POST /api/v1/admin/media/bulk-upload`
- `GET /api/v1/admin/media/files`
- `GET /api/v1/admin/media/files/:mediaFileId`
- `PATCH /api/v1/admin/media/files/:mediaFileId`
- `DELETE /api/v1/admin/media/files/:mediaFileId`
- `GET /api/v1/admin/media/files/:mediaFileId/signed-url`
- `POST /api/v1/vendor/media/upload`
- `GET /api/v1/vendor/media/files`
- `GET /api/v1/vendor/media/files/:mediaFileId`
- `DELETE /api/v1/vendor/media/files/:mediaFileId`
- `POST /api/v1/internal/media/attach-owner`
- `GET /api/v1/internal/media/files/:mediaFileId`

**DB fields:** Validated body/query per PDF pages 184–186, 191.

**Implementation steps:**
1. Upload body: optional `ownerType`, `ownerId`; required `filePurpose`; optional `isPublic`, `metadata`.
2. Bulk: field `files`; same body fields.
3. List query: pagination + filters + `sortBy`, `sortOrder`.
4. PATCH: optional `ownerType`, `ownerId`, `filePurpose`, `isPublic`, `metadata`, `status`.
5. Attach-owner: `mediaFileId`, `ownerType`, `ownerId`, optional `filePurpose`.
6. Params: `mediaFileId` as ObjectId.

**Acceptance criteria:**
- Validators export Zod schemas; no controllers.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 13 — Media validation service

**Ticket:** 13 — Media validation service

**Objective:** Validate uploaded files before storage persistence.

**Files to create/update:**
- `backend/api/src/modules/media/services/media-validation.service.ts`

**API endpoints:** None (called from upload service).

**DB fields:** None.

**Implementation steps:**
1. `validateUploadedFile(file, filePurpose)` per PDF pages 186–187.
2. Verify MIME allowed, extension matches MIME, size within limit, not empty.
3. Block SVG unless explicitly allowed later.
4. Map errors to `MEDIA_*` codes.

**Acceptance criteria:**
- Service throws `AppError` with correct codes.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 3, 6.

---

## Ticket 14 — Media file service: upload and bulk upload

**Ticket:** 14 — Media file service: upload and bulk upload

**Objective:** Single and bulk upload with storage adapter + DB record creation.

**Files to create/update:**
- `backend/api/src/modules/media/services/media-file.service.ts` (partial)

**API endpoints:**
- `POST /api/v1/admin/media/upload`
- `POST /api/v1/admin/media/bulk-upload`
- `POST /api/v1/vendor/media/upload`

**DB fields:** On create set fields per PDF pages 187–188: `uploadedBy`, `uploadedByRole`, `uploadedFromSurface`, `fileCategory`, `filePurpose`, `originalFileName`, `storedFileName`, `storageKey`, `publicUrl`, `mimeType`, `extension`, `sizeBytes`, `checksum`, `storageProvider`, `status=active`; optional `ownerType`/`ownerId`; default `isPublic` by purpose.

**Implementation steps:**
1. Validate file → checksum → stored name → storage key → adapter upload → create record.
2. `bulkUploadMediaFiles`: process independently; return `{ uploadedCount, failedCount, files, errors }`.
3. Audit: `media.file_uploaded`, `media.files_bulk_uploaded`.
4. Remove temp files on failure (hook for Ticket 23 cleanup util).

**Acceptance criteria:**
- Upload returns mapped response with `publicUrl`; bulk returns summary.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 6–11, 13.

---

## Ticket 15 — Media file service: CRUD, signed URL, and attach owner

**Ticket:** 15 — Media file service: CRUD, signed URL, and attach owner

**Objective:** Read, update metadata, delete, signed URL, and internal owner attach.

**Files to create/update:**
- `backend/api/src/modules/media/services/media-file.service.ts` (extend)

**API endpoints:**
- `GET /api/v1/admin/media/files`, `GET .../:mediaFileId`
- `PATCH /api/v1/admin/media/files/:mediaFileId`
- `DELETE /api/v1/admin/media/files/:mediaFileId`
- `GET /api/v1/admin/media/files/:mediaFileId/signed-url`
- Vendor GET list/detail, DELETE
- `POST /api/v1/internal/media/attach-owner`
- `GET /api/v1/internal/media/files/:mediaFileId`

**DB fields:** Update allowed: `ownerType`, `ownerId`, `filePurpose`, `isPublic`, `metadata`, `status`. Delete: soft delete `isDeleted=true`, `deletedAt`, `deletedBy`, `status=deleted`; call adapter `deleteFile(storageKey)`.

**Implementation steps:**
1. `getMediaFileById` → `MEDIA_FILE_NOT_FOUND` if missing/deleted.
2. `listMediaFiles` paginated, default sort `createdAt desc`.
3. `updateMediaFile` metadata only; auto `updatedAt`.
4. `deleteMediaFile` storage + soft delete; audit `media.file_deleted`.
5. `getSignedMediaUrl`: public URL when `isPublic`; else adapter signed URL; audit `media.signed_url_generated`.
6. `attachMediaOwner(mediaFileId, ownerType, ownerId, filePurpose, actorId)`; audit `media.owner_attached`.
7. Vendor scope: enforce vendor/store access → `MEDIA_ACCESS_DENIED` when out of scope.

**Acceptance criteria:**
- All service methods implemented for PDF endpoints.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 14.

---

## Ticket 16 — Global error codes, MEDIA permissions, and role seeds

**Ticket:** 16 — Global error codes, MEDIA permissions, and role seeds

**Objective:** Register media errors; add `media` resource permissions; seed admin and vendor roles.

**Files to create/update:**
- `backend/api/src/errors/error-codes.ts`
- `backend/api/src/modules/auth/constants/auth-permission.constants.ts` — add `MEDIA` resource; add `UPLOAD` action if needed for `media:upload`
- `backend/api/src/database/seeds/seed-roles.ts`
- `docs/security/media-upload-permissions.md` — mark IMPLEMENTED when done

**API endpoints:** Permission gates:
- `media:upload` — POST upload/bulk-upload (admin + vendor)
- `media:read` — GET list/detail/signed-url
- `media:update` — PATCH
- `media:delete` — DELETE

**DB fields:** `roles.permissions` updates.

**Implementation steps:**
1. Register all `MEDIA_*` error codes from Ticket 3.
2. Seed `operations_admin` (and `super_admin` via `*:*`) with `media:read|upload|update|delete`.
3. Seed vendor roles `vendor_owner`, `store_manager`, `store_staff` with vendor media perms per PDF page 192.
4. Map permission codes via `createPermissionCode(AUTH_PERMISSION_RESOURCE.MEDIA, ...)`.

**Acceptance criteria:**
- `npm run test:seed-matrix` still passes after seed updates.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run test:seed-matrix -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 17 — Media admin controllers

**Ticket:** 17 — Media admin controllers

**Objective:** HTTP handlers for seven admin media endpoints.

**Files to create/update:**
- `backend/api/src/modules/media/controllers/media-admin.controller.ts`

**API endpoints:**
- `POST /api/v1/admin/media/upload`
- `POST /api/v1/admin/media/bulk-upload`
- `GET /api/v1/admin/media/files`
- `GET /api/v1/admin/media/files/:mediaFileId`
- `PATCH /api/v1/admin/media/files/:mediaFileId`
- `DELETE /api/v1/admin/media/files/:mediaFileId`
- `GET /api/v1/admin/media/files/:mediaFileId/signed-url`

**DB fields:** None (delegate to service).

**Implementation steps:**
1. Use `asyncHandler`, standard success/created/paginated responses.
2. Pass actor from `req.user`.

**Acceptance criteria:**
- Seven controller methods compile.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 15.

---

## Ticket 18 — Media vendor controllers

**Ticket:** 18 — Media vendor controllers

**Objective:** HTTP handlers for vendor media endpoints with tenant scope.

**Files to create/update:**
- `backend/api/src/modules/media/controllers/media-vendor.controller.ts`

**API endpoints:**
- `POST /api/v1/vendor/media/upload`
- `GET /api/v1/vendor/media/files`
- `GET /api/v1/vendor/media/files/:mediaFileId`
- `DELETE /api/v1/vendor/media/files/:mediaFileId`

**DB fields:** None.

**Implementation steps:**
1. Scope list/detail/delete to authenticated vendor/store per PDF page 189.
2. Standard API response format.

**Acceptance criteria:**
- Four vendor controller methods compile.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 15.

---

## Ticket 19 — Media internal controllers

**Ticket:** 19 — Media internal controllers

**Objective:** HTTP handlers for internal attach-owner and media detail.

**Files to create/update:**
- `backend/api/src/modules/media/controllers/media-internal.controller.ts`

**API endpoints:**
- `POST /api/v1/internal/media/attach-owner`
- `GET /api/v1/internal/media/files/:mediaFileId`

**DB fields:** None.

**Implementation steps:**
1. Use internal auth pattern (`authenticate()` like inventory locks).
2. Delegate to `attachMediaOwner` and `getMediaFileById`.

**Acceptance criteria:**
- Two internal controller methods compile.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 15.

---

## Ticket 20 — Media admin routes

**Ticket:** 20 — Media admin routes

**Objective:** Register admin media routes with auth, permissions, upload middleware, validators.

**Files to create/update:**
- `backend/api/src/modules/media/routes/media-admin.routes.ts`

**API endpoints:** All seven admin endpoints with middleware per PDF pages 189–190.

**DB fields:** None.

**Implementation steps:**
1. `media:upload` on POST upload + bulk-upload.
2. `media:read` on GET routes + signed-url.
3. `media:update` on PATCH.
4. `media:delete` on DELETE.
5. Mount `expire-due` N/A; register static path order: list before `:mediaFileId` where needed.

**Acceptance criteria:**
- Router exports; not mounted until Ticket 23.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 11–12, 16–17.

---

## Ticket 21 — Media vendor routes

**Ticket:** 21 — Media vendor routes

**Objective:** Register vendor media routes with auth, tenant middleware, permissions.

**Files to create/update:**
- `backend/api/src/modules/media/routes/media-vendor.routes.ts`

**API endpoints:** Four vendor endpoints per Ticket 18.

**DB fields:** None.

**Implementation steps:**
1. `authenticate()`, vendor scope middleware, `media:upload|read|delete` per route.
2. Upload middleware on POST upload only.

**Acceptance criteria:**
- Router exports; not mounted until Ticket 23.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 11–12, 16, 18.

---

## Ticket 22 — Media internal routes

**Ticket:** 22 — Media internal routes

**Objective:** Register internal media routes with internal authentication.

**Files to create/update:**
- `backend/api/src/modules/media/routes/media-internal.routes.ts`

**API endpoints:**
- `POST /api/v1/internal/media/attach-owner`
- `GET /api/v1/internal/media/files/:mediaFileId`

**DB fields:** None.

**Implementation steps:**
1. `authenticate()` on all internal media routes.
2. Validators from Ticket 12.

**Acceptance criteria:**
- Router exports; not mounted until Ticket 23.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 12, 16, 19.

---

## Ticket 23 — Mount routes, static local serving, upload bootstrap, and temp cleanup

**Ticket:** 23 — Mount routes, static local serving, upload bootstrap, and temp cleanup

**Objective:** Mount media routers; serve local uploads in dev; bootstrap upload directory; cleanup failed temps.

**Files to create/update:**
- `backend/api/src/routes/v1/admin.routes.ts` — mount `/media`
- `backend/api/src/routes/v1/vendor.routes.ts` — mount `/media`
- `backend/api/src/routes/v1/internal.routes.ts` — mount `/media`
- `backend/api/src/app.ts` or bootstrap — static route for local uploads when `MEDIA_STORAGE_PROVIDER=local` and `APP_ENV !== production`
- `backend/api/src/bootstrap/media-upload-dir.bootstrap.ts`
- `backend/api/src/modules/media/utils/media-temp-cleanup.util.ts`
- `backend/api/.gitignore` — `uploads/`
- Call upload-dir bootstrap from server startup

**API endpoints:** Mounted paths:
- `/api/v1/admin/media/*`
- `/api/v1/vendor/media/*`
- `/api/v1/internal/media/*`

**DB fields:** None.

**Implementation steps:**
1. Static serving only when local provider + non-production (PDF page 200).
2. Auto-create `MEDIA_LOCAL_UPLOAD_DIR` in development.
3. Cleanup util removes temp files after validation/storage failure.
4. Register bootstrap on `startServer`.

**Acceptance criteria:**
- Route tree includes all 13 PDF endpoints; local files reachable at `MEDIA_PUBLIC_BASE_URL` in dev.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run build -w backend/api`

**Depends on:** Tickets 20–22.

---

## Ticket 24 — Catalog entity media URL and attach-owner integration

**Ticket:** 24 — Catalog entity media URL and attach-owner integration

**Objective:** Wire catalog services to accept uploaded media URLs and call internal attach-owner when `mediaFileId` provided.

**Files to create/update:**
- `backend/api/src/modules/catalog/categories/services/category.service.ts` (update — `iconUrl`, `bannerUrl`)
- `backend/api/src/modules/catalog/brands/services/brand.service.ts` (update — `logoUrl`, `bannerUrl`)
- `backend/api/src/modules/catalog/products/services/product.service.ts` (update — `defaultImageUrl`, `imageUrls`)
- `backend/api/src/modules/catalog/variants/services/product-variant.service.ts` (update — `imageUrl`)
- Validators for above modules if new optional `mediaFileId` fields added per integration pattern

**API endpoints:** No new public endpoints; uses `POST /api/v1/internal/media/attach-owner` from catalog update flows when `mediaFileId` present.

**DB fields:** Catalog URL fields listed in Ticket 1; `media_files.ownerType`, `ownerId`, `filePurpose` via attach.

**Implementation steps:**
1. Accept media URL on create/update payloads where catalog APIs already support URL fields.
2. When `mediaFileId` provided, call `attachMediaOwner` with correct `ownerType`/`filePurpose` mapping.
3. Do not add full catalog media upload endpoints (`/catalog/media/*`) — PDF uses `/admin/media/*` only.

**Acceptance criteria:**
- Category/brand/product/variant can reference uploaded media; attach-owner invoked when ID supplied.

**Test commands:**
- `npm run test:categories -w backend/api` (or relevant catalog test scripts)
- `npm run test:products -w backend/api`
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 15, 23.

---

## Ticket 25 — OpenAPI, contract docs, and route registry

**Ticket:** 25 — OpenAPI, contract docs, and route registry

**Objective:** Document all media APIs; update architecture doc status.

**Files to create/update:**
- `backend/api/src/docs/openapi/media.paths.ts` (create)
- `backend/api/src/docs/openapi/index.ts`
- `docs/contracts/media-file-upload-api.md` (create)
- `docs/contracts/backend-route-registry.md`
- `docs/errors/media-upload-error-codes.md` — status IMPLEMENTED
- `docs/architecture/catalog-media-architecture.md` — note PDF path `/admin/media` is canonical; mark IMPLEMENTED for storage metadata portions

**API endpoints:** Document all admin (7), vendor (4), internal (2) endpoints with multipart and response shapes per PDF pages 193–196.

**DB fields:** Document full `media_files.*` in contract doc.

**Implementation steps:**
1. OpenAPI placeholder responses (inventory pattern).
2. Registry sections: admin media, vendor media, internal media.
3. Document audit metadata must not include raw buffers, tokens, AWS secrets (PDF page 193).

**Acceptance criteria:**
- Contracts match validators and response mapper.

**Test commands:**
- `npm run build -w backend/api`

**Depends on:** Ticket 23.

---

## Ticket 26 — Media utility unit tests

**Ticket:** 26 — Media utility unit tests

**Objective:** Unit tests for naming, storage key, category detection, checksum.

**Files to create/update:**
- `backend/api/src/modules/media/utils/media-file-name.util.test.ts`
- `backend/api/src/modules/media/utils/media-storage-key.util.test.ts`
- `backend/api/src/modules/media/utils/media-category.util.test.ts`
- `backend/api/src/modules/media/utils/media-checksum.util.test.ts`

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Sanitize strips unsafe characters; stored name format `timestamp_random.extension`.
2. Storage key uses purpose/owner folder convention.
3. MIME → category mapping per PDF.
4. Checksum deterministic for known buffer.

**Acceptance criteria:**
- Tests pass without MongoDB.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/media/utils/media-file-name.util.test.js dist/modules/media/utils/media-storage-key.util.test.js dist/modules/media/utils/media-category.util.test.js dist/modules/media/utils/media-checksum.util.test.js`

**Depends on:** Ticket 6.

---

## Ticket 27 — Media validation and file service unit tests

**Ticket:** 27 — Media validation and file service unit tests

**Objective:** Service tests for validation and upload/CRUD/attach flows (mocked storage/repo).

**Files to create/update:**
- `backend/api/src/modules/media/services/media-validation.service.test.ts`
- `backend/api/src/modules/media/services/media-file.service.test.ts`

**API endpoints:** None.

**DB fields:** Fixtures for active/deleted media records.

**Implementation steps:**
1. Per PDF pages 197–198: JPEG/PNG/WEBP success; SVG/HTML blocked; empty file blocked; oversize blocked; sanitize name; storage key convention; checksum stored; delete calls adapter + soft delete; signed URL public vs private; owner attach updates fields.
2. Mock storage adapter, repository, audit.

**Acceptance criteria:**
- Tests pass without live storage or MongoDB.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/media/services/media-validation.service.test.js dist/modules/media/services/media-file.service.test.js`

**Depends on:** Tickets 13–15.

---

## Ticket 28 — Media controller unit tests

**Ticket:** 28 — Media controller unit tests

**Objective:** Controller smoke tests with mocked services.

**Files to create/update:**
- `backend/api/src/modules/media/controllers/media-admin.controller.test.ts`
- `backend/api/src/modules/media/controllers/media-vendor.controller.test.ts`
- `backend/api/src/modules/media/controllers/media-internal.controller.test.ts`

**API endpoints:** Smoke-test upload, list, detail, patch, delete, signed-url, attach-owner.

**DB fields:** None.

**Implementation steps:**
1. Mirror inventory lock controller test mock pattern.
2. Assert `{ success, data }` and status codes.

**Acceptance criteria:**
- Controller tests pass without HTTP server.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/media/controllers/media-admin.controller.test.js dist/modules/media/controllers/media-vendor.controller.test.js dist/modules/media/controllers/media-internal.controller.test.js`

**Depends on:** Tickets 17–19.

---

## Ticket 29 — Route integration tests (optional)

**Ticket:** 29 — Route integration tests (optional)

**Objective:** HTTP route tests per PDF pages 198–199, or document deferral.

**Files to create/update:**
- `backend/api/src/modules/media/routes/media-admin.routes.test.ts` (optional)
- `backend/api/src/modules/media/routes/media-vendor.routes.test.ts` (optional)
- `backend/api/src/modules/media/routes/media-internal.routes.test.ts` (optional)
- `docs/reviews/media-file-upload-foundation-review.md` (note deferral if skipped)

**API endpoints:** 401 unauthenticated; 403 missing `media:upload`; success paths; `MEDIA_INVALID_MIME_TYPE`; vendor scope `MEDIA_ACCESS_DENIED`; internal `MEDIA_FILE_NOT_FOUND`.

**DB fields:** None.

**Implementation steps:**
1. If deferred: document in module review; service/controller tests sufficient.
2. If implemented: follow PDF route matrices pages 198–199.

**Acceptance criteria:**
- Either route tests pass or deferral documented.

**Test commands:**
- `npm run test:media -w backend/api` OR documented N/A

**Depends on:** Ticket 23.

---

## Ticket 30 — Quality gates and npm test entrypoints

**Ticket:** 30 — Quality gates and npm test entrypoints

**Objective:** Add `test:media` script and run full quality gates.

**Files to create/update:**
- `backend/api/package.json` — `test:media` aggregating Tickets 26–28 tests

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `test:media`: util, validation, service, controller tests.
2. Regression: `test:categories`, `test:products`, `test:variants`, `test:brands`, `test:seed-matrix`, `test:inventory`, `test:inventory-locks`.

**Acceptance criteria:**
- `npm run typecheck`, `npm run lint`, `npm run test:media` pass.
- Catalog/inventory tests still pass.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:media -w backend/api`
- `npm run test:seed-matrix -w backend/api`

**Depends on:** Tickets 26–28, 24.

---

## Ticket 31 — Module review, handoff, and project-context closeout

**Ticket:** 31 — Module review, handoff, and project-context closeout

**Objective:** Close Media & File Upload Foundation with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/media-file-upload-foundation-review.md` (create)
- `docs/handoffs/media-file-upload-foundation-complete.md` (create)
- `docs/reviews/phase-3-media-file-upload-foundation-execution-tickets.md` — mark all tickets DONE
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md`

**API endpoints:** Verify all 13 endpoints in review doc (7 admin + 4 vendor + 2 internal).

**DB fields:** Verify `media_files.*` per PDF pages 201–202.

**Implementation steps:**
1. Verification table: endpoints, permissions, audit, errors, storage adapters, catalog URL integration.
2. Note pending: production S3/GCS/CDN finalization; Admin Dashboard catalog UI (module 11).
3. Set next module: **Admin Dashboard — Catalog Foundation** per PDF order.

**Acceptance criteria:**
- Handoff marks module complete for static/code verification.
- No admin-dashboard frontend started.
- Tracker all DONE.

**Test commands:**
- All commands from Ticket 30

**Depends on:** Ticket 30.

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 4 → 5 → 6 → 7
4 → 10
5 → 8 → 9
3,6 → 13 → 14 → 15
10,9,11,13 → 14
15 → 17,18,19
3 → 16
16,11,12,17 → 20
16,11,12,18 → 21
12,16,19 → 22
20,21,22 → 23 → 25
15,23 → 24
6 → 26
13,14,15 → 27
17,18,19 → 28
23 → 29
26,27,28,24 → 30 → 31
```

**Critical path:** 1 → 2 → 4 → 10 → 14 → 15 → 17 → 20 → 23 → 30 → 31  
(Parallel: 6–9 storage; 16 permissions; 18–19 vendor/internal; 24 catalog integration; 26–28 tests)

**Cross-module order:** Catalog + Inventory backends before media; media before Admin Dashboard Catalog UI (module 11).
