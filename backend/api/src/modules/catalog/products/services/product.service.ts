import { Types } from 'mongoose';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { writeAuditLog } from '../../../audit';
import { PRODUCT_APPROVAL_STATUS } from '../constants/product-approval-status.constant';
import { PRODUCT_AUDIT_EVENTS } from '../constants/product-audit-events.constant';
import { PRODUCT_ERROR_CODES, type ProductErrorCode } from '../constants/product-error-codes.constant';
import type { ProductRecord } from '../models/product.model';
import {
  createProduct as createProductRecord,
  findProductById,
  findProductBySlug,
  listProducts as listProductsRecord,
  softDeleteProductById,
  updateProductById,
} from '../repositories/product.repository';
import type {
  CreateProductInput,
  ProductListQuery,
  UpdateProductApprovalInput,
  UpdateProductInput,
} from '../types/product.types';
import { generateProductSlug, normalizeProductSlug } from '../utils/product-slug.util';
import { attachProductMedia } from '../../../media/utils/catalog-media-attachment.util';
import { toProductResponse } from '../utils/product-response.mapper';
import { countStoreProductsByProduct } from '../../../store-products/repositories/store-product.repository';
import { countActiveVariantsByProduct } from '../../variants/repositories/product-variant.repository';
import {
  validateProductBrandReference,
  validateProductCategoryReferences,
} from './product-reference.service';

const productError = (code: ProductErrorCode): ErrorCode => ERROR_CODES[code];

const clearApprovalMetadata = (): Partial<ProductRecord> => ({
  approvedBy: null,
  approvedAt: null,
  rejectedBy: null,
  rejectedAt: null,
  rejectionReason: null,
});

const hasCriticalFieldChanges = (
  existing: ProductRecord,
  input: UpdateProductInput,
): boolean => {
  const criticalKeys: (keyof UpdateProductInput)[] = [
    'name',
    'description',
    'categoryId',
    'subcategoryId',
    'brandId',
    'productType',
    'foodType',
    'defaultImageUrl',
    'imageUrls',
  ];

  return criticalKeys.some((key) => {
    if (input[key] === undefined) {
      return false;
    }

    const existingValue = existing[key as keyof ProductRecord];
    const nextValue = input[key];

    if (existingValue instanceof Types.ObjectId) {
      return existingValue.toString() !== String(nextValue ?? '');
    }

    if (Array.isArray(existingValue) && Array.isArray(nextValue)) {
      return JSON.stringify(existingValue) !== JSON.stringify(nextValue);
    }

    return existingValue !== nextValue;
  });
};

const resolveSlugForCreate = async (name: string, slug?: string): Promise<string> => {
  const resolvedSlug = normalizeProductSlug(slug ?? generateProductSlug(name));

  if (!resolvedSlug) {
    throw new AppError({
      message: 'Product slug is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findProductBySlug(resolvedSlug);

  if (existing) {
    throw new AppError({
      message: 'Product slug already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: productError(PRODUCT_ERROR_CODES.PRODUCT_SLUG_ALREADY_EXISTS),
    });
  }

  return resolvedSlug;
};

const resolveSlugForUpdate = async (
  productId: string,
  name: string,
  currentSlug: string,
  slug?: string,
): Promise<string> => {
  const resolvedSlug = slug ? normalizeProductSlug(slug) : currentSlug;

  if (!resolvedSlug) {
    throw new AppError({
      message: 'Product slug is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findProductBySlug(resolvedSlug, productId);

  if (existing) {
    throw new AppError({
      message: 'Product slug already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: productError(PRODUCT_ERROR_CODES.PRODUCT_SLUG_ALREADY_EXISTS),
    });
  }

  if (!slug && name) {
    return currentSlug;
  }

  return resolvedSlug;
};

const toObjectIdOrNull = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }

  return new Types.ObjectId(value);
};

export const listProducts = async (query: ProductListQuery) => {
  const response = await listProductsRecord(query);

  return {
    items: response.items.map(toProductResponse),
    pagination: {
      page: query.page,
      limit: query.limit,
      total: response.total,
      totalPages: Math.max(1, Math.ceil(response.total / query.limit)),
      hasNextPage: query.page * query.limit < response.total,
      hasPreviousPage: query.page > 1,
    },
  };
};

export const getProductById = async (productId: string) => {
  const product = await findProductById(productId);

  if (!product) {
    throw new AppError({
      message: 'Product not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: productError(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND),
    });
  }

  return toProductResponse(product);
};

export const createProduct = async (input: CreateProductInput, actorUserId: string) => {
  await validateProductCategoryReferences({
    categoryId: input.categoryId,
    subcategoryId: input.subcategoryId ?? null,
  });
  await validateProductBrandReference(input.brandId ?? null);

  const slug = await resolveSlugForCreate(input.name, input.slug);
  const actorId = toObjectIdOrNull(actorUserId);

  const created = await createProductRecord({
    name: input.name.trim(),
    slug,
    description: input.description ?? null,
    shortDescription: input.shortDescription ?? null,
    categoryId: new Types.ObjectId(input.categoryId),
    subcategoryId: toObjectIdOrNull(input.subcategoryId),
    brandId: toObjectIdOrNull(input.brandId),
    productType: input.productType,
    foodType: input.foodType ?? null,
    taxCategoryId: toObjectIdOrNull(input.taxCategoryId),
    hsnCode: input.hsnCode ?? null,
    searchKeywords: input.searchKeywords ?? [],
    tags: input.tags ?? [],
    defaultImageUrl: input.defaultImageUrl ?? null,
    imageUrls: input.imageUrls ?? [],
    attributeSummary: input.attributeSummary ?? null,
    isFeatured: input.isFeatured ?? false,
    isVisible: input.isVisible ?? true,
    approvalStatus: PRODUCT_APPROVAL_STATUS.DRAFT,
    status: input.status ?? 'active',
    createdBy: actorId,
    updatedBy: actorId,
  });

  const mediaUrls = await attachProductMedia(
    created._id.toString(),
    { defaultImageMediaFileId: input.defaultImageMediaFileId },
    actorUserId,
  );

  let responseRecord = created;
  if (mediaUrls.defaultImageUrl) {
    const patched = await updateProductById(created._id.toString(), {
      defaultImageUrl: mediaUrls.defaultImageUrl,
      updatedBy: actorId,
    });
    if (patched) {
      responseRecord = patched;
    }
  }

  await writeAuditLog({
    eventType: PRODUCT_AUDIT_EVENTS.PRODUCT_CREATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'product',
    entityId: responseRecord._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      productId: created._id.toString(),
      slug: created.slug,
    },
    status: 'success',
  });

  return toProductResponse(responseRecord);
};

export const updateProduct = async (
  productId: string,
  input: UpdateProductInput,
  actorUserId: string,
) => {
  const existing = await findProductById(productId);

  if (!existing) {
    throw new AppError({
      message: 'Product not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: productError(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND),
    });
  }

  const categoryId = input.categoryId ?? existing.categoryId.toString();
  const subcategoryId =
    input.subcategoryId !== undefined
      ? input.subcategoryId
      : existing.subcategoryId
        ? existing.subcategoryId.toString()
        : null;

  if (
    input.categoryId !== undefined ||
    input.subcategoryId !== undefined
  ) {
    await validateProductCategoryReferences({ categoryId, subcategoryId });
  }

  if (input.brandId !== undefined) {
    await validateProductBrandReference(input.brandId);
  }

  const slug = await resolveSlugForUpdate(
    productId,
    input.name ?? existing.name,
    existing.slug,
    input.slug,
  );

  const actorId = toObjectIdOrNull(actorUserId);
  const resetApproval = hasCriticalFieldChanges(existing, input);

  const updated = await updateProductById(productId, {
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    slug,
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.shortDescription !== undefined
      ? { shortDescription: input.shortDescription }
      : {}),
    ...(input.categoryId !== undefined
      ? { categoryId: new Types.ObjectId(input.categoryId) }
      : {}),
    ...(input.subcategoryId !== undefined
      ? { subcategoryId: toObjectIdOrNull(input.subcategoryId) }
      : {}),
    ...(input.brandId !== undefined ? { brandId: toObjectIdOrNull(input.brandId) } : {}),
    ...(input.productType !== undefined ? { productType: input.productType } : {}),
    ...(input.foodType !== undefined ? { foodType: input.foodType } : {}),
    ...(input.taxCategoryId !== undefined
      ? { taxCategoryId: toObjectIdOrNull(input.taxCategoryId) }
      : {}),
    ...(input.hsnCode !== undefined ? { hsnCode: input.hsnCode } : {}),
    ...(input.searchKeywords !== undefined ? { searchKeywords: input.searchKeywords } : {}),
    ...(input.tags !== undefined ? { tags: input.tags } : {}),
    ...(input.defaultImageUrl !== undefined ? { defaultImageUrl: input.defaultImageUrl } : {}),
    ...(input.imageUrls !== undefined ? { imageUrls: input.imageUrls } : {}),
    ...(input.attributeSummary !== undefined
      ? { attributeSummary: input.attributeSummary }
      : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
    ...(input.isVisible !== undefined ? { isVisible: input.isVisible } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(resetApproval
      ? {
          approvalStatus: PRODUCT_APPROVAL_STATUS.PENDING_REVIEW,
          ...clearApprovalMetadata(),
        }
      : {}),
    updatedBy: actorId,
  });

  if (!updated) {
    throw new AppError({
      message: 'Product not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: productError(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND),
    });
  }

  const mediaUrls = await attachProductMedia(
    productId,
    { defaultImageMediaFileId: input.defaultImageMediaFileId },
    actorUserId,
  );

  let responseRecord = updated;
  if (mediaUrls.defaultImageUrl) {
    const patched = await updateProductById(productId, {
      defaultImageUrl: mediaUrls.defaultImageUrl,
      updatedBy: actorId,
    });
    if (patched) {
      responseRecord = patched;
    }
  }

  await writeAuditLog({
    eventType: PRODUCT_AUDIT_EVENTS.PRODUCT_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'product',
    entityId: responseRecord._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      productId: responseRecord._id.toString(),
    },
    status: 'success',
  });

  return toProductResponse(responseRecord);
};

export const updateProductApprovalStatus = async (
  productId: string,
  input: UpdateProductApprovalInput,
  actorUserId: string,
) => {
  const existing = await findProductById(productId);

  if (!existing) {
    throw new AppError({
      message: 'Product not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: productError(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND),
    });
  }

  if (input.approvalStatus === 'rejected' && !input.rejectionReason?.trim()) {
    throw new AppError({
      message: 'Rejection reason is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: productError(PRODUCT_ERROR_CODES.REJECTION_REASON_REQUIRED),
    });
  }

  const actorId = toObjectIdOrNull(actorUserId);
  const approvalUpdate: Partial<ProductRecord> = {
    approvalStatus: input.approvalStatus,
    updatedBy: actorId,
  };

  if (input.approvalStatus === 'approved') {
    approvalUpdate.approvedBy = actorId;
    approvalUpdate.approvedAt = new Date();
    approvalUpdate.rejectedBy = null;
    approvalUpdate.rejectedAt = null;
    approvalUpdate.rejectionReason = null;
  } else if (input.approvalStatus === 'rejected') {
    approvalUpdate.rejectedBy = actorId;
    approvalUpdate.rejectedAt = new Date();
    approvalUpdate.rejectionReason = input.rejectionReason?.trim() ?? null;
    approvalUpdate.approvedBy = null;
    approvalUpdate.approvedAt = null;
  } else if (input.approvalStatus === 'pending_review') {
    Object.assign(approvalUpdate, clearApprovalMetadata());
  }

  const updated = await updateProductById(productId, approvalUpdate);

  if (!updated) {
    throw new AppError({
      message: 'Product not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: productError(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: PRODUCT_AUDIT_EVENTS.PRODUCT_APPROVAL_STATUS_CHANGED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'product',
    entityId: updated._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      productId: updated._id.toString(),
      approvalStatus: updated.approvalStatus,
    },
    status: 'success',
  });

  return toProductResponse(updated);
};

export const deleteProduct = async (productId: string, actorUserId: string) => {
  const existing = await findProductById(productId);

  if (!existing) {
    throw new AppError({
      message: 'Product not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: productError(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND),
    });
  }

  const variantCount = await countActiveVariantsByProduct(productId);

  if (variantCount > 0) {
    throw new AppError({
      message: 'Product has active variants and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: productError(PRODUCT_ERROR_CODES.PRODUCT_HAS_ACTIVE_VARIANTS),
    });
  }

  const storeProductCount = await countStoreProductsByProduct(productId);

  if (storeProductCount > 0) {
    throw new AppError({
      message: 'Product has active store mappings and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: productError(PRODUCT_ERROR_CODES.PRODUCT_HAS_ACTIVE_STORE_PRODUCTS),
    });
  }

  const actorId = toObjectIdOrNull(actorUserId);

  const deleted = await softDeleteProductById(productId, actorId);

  if (!deleted) {
    throw new AppError({
      message: 'Product not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: productError(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: PRODUCT_AUDIT_EVENTS.PRODUCT_DELETED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'product',
    entityId: deleted._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      productId: deleted._id.toString(),
    },
    status: 'success',
  });

  return toProductResponse(deleted);
};
