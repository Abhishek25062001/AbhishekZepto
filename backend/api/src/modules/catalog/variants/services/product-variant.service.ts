import { Types } from 'mongoose';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { writeAuditLog } from '../../../audit';
import { VARIANT_AUDIT_EVENTS } from '../constants/variant-audit-events.constant';
import {
  VARIANT_ERROR_CODES,
  type VariantErrorCode,
} from '../constants/variant-error-codes.constant';
import { VARIANT_STATUS } from '../constants/variant-status.constant';
import type { ProductVariantRecord } from '../models/product-variant.model';
import { countStoreProductsByVariant } from '../../../store-products/repositories/store-product.repository';
import {
  clearDefaultVariantForProduct,
  countActiveVariantsByProduct,
  countVariantsUsingUnit,
  createProductVariant as createProductVariantRecord,
  findOldestActiveVariantForProduct,
  findProductVariantByBarcode,
  findProductVariantByProductAndId,
  findProductVariantBySku,
  listProductVariantsByProductId,
  setDefaultVariantById,
  softDeleteProductVariantById,
  updateProductVariantById,
} from '../repositories/product-variant.repository';
import type {
  CreateProductVariantInput,
  ProductVariantListQuery,
  UpdateProductVariantInput,
} from '../types/product-variant.types';
import {
  normalizeProductVariantBarcode,
  normalizeProductVariantSku,
} from '../utils/product-variant-sku.util';
import { attachVariantMedia } from '../../../media/utils/catalog-media-attachment.util';
import { toProductVariantResponse } from '../utils/product-variant-response.mapper';
import { assertProductExistsForVariant } from './variant-product-reference.service';
import { assertVariantUnitIsValid } from './variant-unit-reference.service';

const variantError = (code: VariantErrorCode): ErrorCode => ERROR_CODES[code];

const toObjectIdOrNull = (value: string): Types.ObjectId | null =>
  Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

const assertSkuAvailable = async (sku: string, excludeId?: string) => {
  const existing = await findProductVariantBySku(sku, excludeId);

  if (existing) {
    throw new AppError({
      message: 'SKU already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: variantError(VARIANT_ERROR_CODES.SKU_ALREADY_EXISTS),
    });
  }
};

const assertBarcodeAvailable = async (barcode: string | null | undefined, excludeId?: string) => {
  if (!barcode?.trim()) {
    return;
  }

  const normalized = normalizeProductVariantBarcode(barcode);
  const existing = await findProductVariantByBarcode(normalized, excludeId);

  if (existing) {
    throw new AppError({
      message: 'Barcode already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: variantError(VARIANT_ERROR_CODES.BARCODE_ALREADY_EXISTS),
    });
  }
};

const resolveVariantForProduct = async (productId: string, variantId: string) => {
  const variant = await findProductVariantByProductAndId(productId, variantId);

  if (!variant) {
    throw new AppError({
      message: 'Variant not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: variantError(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND),
    });
  }

  return variant;
};

const applyDefaultVariantRulesOnCreate = async (
  productId: string,
  requestedDefault: boolean | undefined,
): Promise<boolean> => {
  const existingCount = await countActiveVariantsByProduct(productId);

  if (existingCount === 0) {
    return true;
  }

  if (requestedDefault) {
    await clearDefaultVariantForProduct(productId);
    return true;
  }

  return false;
};

const applyDefaultVariantRulesOnUpdate = async (
  productId: string,
  variantId: string,
  isDefault: boolean | undefined,
) => {
  if (isDefault === true) {
    await clearDefaultVariantForProduct(productId, variantId);
  }
};

const promoteReplacementDefault = async (productId: string, excludeVariantId: string) => {
  const replacement = await findOldestActiveVariantForProduct(productId, excludeVariantId);

  if (!replacement) {
    throw new AppError({
      message: 'A default variant is required when other variants exist',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      errorCode: variantError(VARIANT_ERROR_CODES.DEFAULT_VARIANT_REQUIRED),
    });
  }

  await setDefaultVariantById(replacement._id.toString());
};

export const createProductVariant = async (
  productId: string,
  input: CreateProductVariantInput,
  actorUserId: string,
) => {
  await assertProductExistsForVariant(productId);
  await assertVariantUnitIsValid(input.unit);

  const sku = normalizeProductVariantSku(input.sku);
  await assertSkuAvailable(sku);
  await assertBarcodeAvailable(input.barcode);

  const isDefault = await applyDefaultVariantRulesOnCreate(productId, input.isDefault);
  const actorId = toObjectIdOrNull(actorUserId);

  const created = await createProductVariantRecord({
    productId: new Types.ObjectId(productId),
    variantName: input.variantName.trim(),
    sku,
    barcode: input.barcode ? normalizeProductVariantBarcode(input.barcode) : null,
    unit: input.unit.trim().toLowerCase(),
    unitValue: input.unitValue,
    mrp: input.mrp,
    defaultSellingPrice: input.defaultSellingPrice ?? null,
    weightInGrams: input.weightInGrams ?? null,
    lengthCm: input.lengthCm ?? null,
    widthCm: input.widthCm ?? null,
    heightCm: input.heightCm ?? null,
    imageUrl: input.imageUrl ?? null,
    attributeValues: input.attributeValues ?? null,
    isDefault,
    isVisible: input.isVisible ?? true,
    status: input.status ?? VARIANT_STATUS.ACTIVE,
    createdBy: actorId,
    updatedBy: actorId,
  });

  const mediaUrls = await attachVariantMedia(
    created._id.toString(),
    { imageMediaFileId: input.imageMediaFileId },
    actorUserId,
  );

  let responseRecord = created;
  if (mediaUrls.imageUrl) {
    const patched = await updateProductVariantById(created._id.toString(), {
      imageUrl: mediaUrls.imageUrl,
      updatedBy: actorId,
    });
    if (patched) {
      responseRecord = patched;
    }
  }

  await writeAuditLog({
    eventType: VARIANT_AUDIT_EVENTS.VARIANT_CREATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'product_variant',
    entityId: responseRecord._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      productId,
      variantId: created._id.toString(),
      sku: created.sku,
    },
    status: 'success',
  });

  return toProductVariantResponse(responseRecord);
};

export const listProductVariants = async (productId: string, query: ProductVariantListQuery) => {
  await assertProductExistsForVariant(productId);

  const { items, total } = await listProductVariantsByProductId(productId, query);
  const totalPages = Math.ceil(total / query.limit) || 1;

  return {
    items: items.map(toProductVariantResponse),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
  };
};

export const updateProductVariant = async (
  productId: string,
  variantId: string,
  input: UpdateProductVariantInput,
  actorUserId: string,
) => {
  await assertProductExistsForVariant(productId);
  const existing = await resolveVariantForProduct(productId, variantId);

  if (input.unit !== undefined) {
    await assertVariantUnitIsValid(input.unit);
  }

  const nextSku =
    input.sku !== undefined ? normalizeProductVariantSku(input.sku) : existing.sku;

  if (nextSku !== existing.sku) {
    await assertSkuAvailable(nextSku, variantId);
  }

  if (input.barcode !== undefined) {
    await assertBarcodeAvailable(input.barcode, variantId);
  }

  if (input.isDefault !== undefined) {
    await applyDefaultVariantRulesOnUpdate(productId, variantId, input.isDefault);
  }

  const actorId = toObjectIdOrNull(actorUserId);

  const updatePayload: Partial<ProductVariantRecord> = {
    updatedBy: actorId,
  };

  if (input.variantName !== undefined) updatePayload.variantName = input.variantName.trim();
  if (input.sku !== undefined) updatePayload.sku = nextSku;
  if (input.barcode !== undefined) {
    updatePayload.barcode = input.barcode
      ? normalizeProductVariantBarcode(input.barcode)
      : null;
  }
  if (input.unit !== undefined) updatePayload.unit = input.unit.trim().toLowerCase();
  if (input.unitValue !== undefined) updatePayload.unitValue = input.unitValue;
  if (input.mrp !== undefined) updatePayload.mrp = input.mrp;
  if (input.defaultSellingPrice !== undefined) {
    updatePayload.defaultSellingPrice = input.defaultSellingPrice;
  }
  if (input.weightInGrams !== undefined) updatePayload.weightInGrams = input.weightInGrams;
  if (input.lengthCm !== undefined) updatePayload.lengthCm = input.lengthCm;
  if (input.widthCm !== undefined) updatePayload.widthCm = input.widthCm;
  if (input.heightCm !== undefined) updatePayload.heightCm = input.heightCm;
  if (input.imageUrl !== undefined) updatePayload.imageUrl = input.imageUrl;
  if (input.attributeValues !== undefined) updatePayload.attributeValues = input.attributeValues;
  if (input.isDefault !== undefined) updatePayload.isDefault = input.isDefault;
  if (input.isVisible !== undefined) updatePayload.isVisible = input.isVisible;
  if (input.status !== undefined) updatePayload.status = input.status;

  const updated = await updateProductVariantById(variantId, updatePayload);

  if (!updated) {
    throw new AppError({
      message: 'Variant not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: variantError(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND),
    });
  }

  const mediaUrls = await attachVariantMedia(
    variantId,
    { imageMediaFileId: input.imageMediaFileId },
    actorUserId,
  );

  let responseRecord = updated;
  if (mediaUrls.imageUrl) {
    const patched = await updateProductVariantById(variantId, {
      imageUrl: mediaUrls.imageUrl,
      updatedBy: actorId,
    });
    if (patched) {
      responseRecord = patched;
    }
  }

  await writeAuditLog({
    eventType: VARIANT_AUDIT_EVENTS.VARIANT_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'product_variant',
    entityId: updated._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      productId,
      variantId: updated._id.toString(),
      changedFields: Object.keys(input),
    },
    status: 'success',
  });

  return toProductVariantResponse(responseRecord);
};

export const deleteProductVariant = async (
  productId: string,
  variantId: string,
  actorUserId: string,
) => {
  await assertProductExistsForVariant(productId);
  const existing = await resolveVariantForProduct(productId, variantId);

  const activeCount = await countActiveVariantsByProduct(productId);

  if (existing.isDefault && activeCount > 1) {
    await promoteReplacementDefault(productId, variantId);
  }

  const storeMappingCount = await countStoreProductsByVariant(variantId);

  if (storeMappingCount > 0) {
    throw new AppError({
      message: 'Variant has active store mappings and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: variantError(VARIANT_ERROR_CODES.VARIANT_HAS_ACTIVE_STORE_MAPPINGS),
    });
  }

  const actorId = toObjectIdOrNull(actorUserId);
  const deleted = await softDeleteProductVariantById(variantId, actorId);

  if (!deleted) {
    throw new AppError({
      message: 'Variant not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: variantError(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: VARIANT_AUDIT_EVENTS.VARIANT_DELETED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'product_variant',
    entityId: deleted._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      productId,
      variantId: deleted._id.toString(),
    },
    status: 'success',
  });

  return toProductVariantResponse(deleted);
};

export { countActiveVariantsByProduct, countVariantsUsingUnit };
