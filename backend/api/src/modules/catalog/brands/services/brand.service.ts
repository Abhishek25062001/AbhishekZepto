import { Types } from 'mongoose';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { writeAuditLog } from '../../../audit';
import { BRAND_AUDIT_EVENTS } from '../constants/brand-audit-events.constant';
import { BRAND_ERROR_CODES, type BrandErrorCode } from '../constants/brand-error-codes.constant';
import {
  createBrand as createBrandRecord,
  findBrandById,
  findBrandBySlug,
  listBrands as listBrandsRecord,
  softDeleteBrandById,
  updateBrandById,
} from '../repositories/brand.repository';
import type { BrandListQuery, CreateBrandInput, UpdateBrandInput } from '../types/brand.types';
import { generateBrandSlug, normalizeBrandSlug } from '../utils/brand-slug.util';
import { attachBrandMedia } from '../../../media/utils/catalog-media-attachment.util';
import { toBrandResponse } from '../utils/brand-response.mapper';

const brandError = (code: BrandErrorCode): ErrorCode => ERROR_CODES[code];

const countActiveProductsByBrand = async (): Promise<number> => {
  // Product Management Backend will wire real product dependency checks.
  return 0;
};

const resolveSlugForCreate = async (name: string, slug?: string): Promise<string> => {
  const resolvedSlug = normalizeBrandSlug(slug ?? generateBrandSlug(name));

  if (!resolvedSlug) {
    throw new AppError({
      message: 'Brand slug is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findBrandBySlug(resolvedSlug);

  if (existing) {
    throw new AppError({
      message: 'Brand slug already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: brandError(BRAND_ERROR_CODES.BRAND_SLUG_ALREADY_EXISTS),
    });
  }

  return resolvedSlug;
};

const resolveSlugForUpdate = async (
  brandId: string,
  name: string,
  currentSlug: string,
  slug?: string,
): Promise<string> => {
  const resolvedSlug = slug ? normalizeBrandSlug(slug) : currentSlug;

  if (!resolvedSlug) {
    throw new AppError({
      message: 'Brand slug is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findBrandBySlug(resolvedSlug, brandId);

  if (existing) {
    throw new AppError({
      message: 'Brand slug already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: brandError(BRAND_ERROR_CODES.BRAND_SLUG_ALREADY_EXISTS),
    });
  }

  if (!slug && name) {
    return currentSlug;
  }

  return resolvedSlug;
};

export const listBrands = async (query: BrandListQuery) => {
  const response = await listBrandsRecord(query);

  return {
    items: response.items.map(toBrandResponse),
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

export const getBrandById = async (brandId: string) => {
  const brand = await findBrandById(brandId);

  if (!brand) {
    throw new AppError({
      message: 'Brand not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: brandError(BRAND_ERROR_CODES.BRAND_NOT_FOUND),
    });
  }

  return toBrandResponse(brand);
};

export const createBrand = async (input: CreateBrandInput, actorUserId: string) => {
  const slug = await resolveSlugForCreate(input.name, input.slug);
  const actorId = Types.ObjectId.isValid(actorUserId) ? new Types.ObjectId(actorUserId) : null;

  const created = await createBrandRecord({
    name: input.name.trim(),
    slug,
    description: input.description ?? null,
    logoUrl: input.logoUrl ?? null,
    bannerUrl: input.bannerUrl ?? null,
    isFeatured: input.isFeatured ?? false,
    isVisible: input.isVisible ?? true,
    status: input.status ?? 'active',
    createdBy: actorId,
    updatedBy: actorId,
  });

  const mediaUrls = await attachBrandMedia(
    created._id.toString(),
    {
      logoMediaFileId: input.logoMediaFileId,
      bannerMediaFileId: input.bannerMediaFileId,
    },
    actorUserId,
  );

  let responseRecord = created;
  if (mediaUrls.logoUrl || mediaUrls.bannerUrl) {
    const patched = await updateBrandById(created._id.toString(), {
      ...(mediaUrls.logoUrl ? { logoUrl: mediaUrls.logoUrl } : {}),
      ...(mediaUrls.bannerUrl ? { bannerUrl: mediaUrls.bannerUrl } : {}),
      updatedBy: actorId,
    });
    if (patched) {
      responseRecord = patched;
    }
  }

  await writeAuditLog({
    eventType: BRAND_AUDIT_EVENTS.BRAND_CREATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'brand',
    entityId: responseRecord._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      brandId: created._id.toString(),
      slug: created.slug,
    },
    status: 'success',
  });

  return toBrandResponse(responseRecord);
};

export const updateBrand = async (
  brandId: string,
  input: UpdateBrandInput,
  actorUserId: string,
) => {
  const existing = await findBrandById(brandId);

  if (!existing) {
    throw new AppError({
      message: 'Brand not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: brandError(BRAND_ERROR_CODES.BRAND_NOT_FOUND),
    });
  }

  const slug = await resolveSlugForUpdate(
    brandId,
    input.name ?? existing.name,
    existing.slug,
    input.slug,
  );

  const actorId = Types.ObjectId.isValid(actorUserId) ? new Types.ObjectId(actorUserId) : null;

  const updated = await updateBrandById(brandId, {
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    slug,
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl } : {}),
    ...(input.bannerUrl !== undefined ? { bannerUrl: input.bannerUrl } : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
    ...(input.isVisible !== undefined ? { isVisible: input.isVisible } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    updatedBy: actorId,
  });

  if (!updated) {
    throw new AppError({
      message: 'Brand not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: brandError(BRAND_ERROR_CODES.BRAND_NOT_FOUND),
    });
  }

  const mediaUrls = await attachBrandMedia(
    brandId,
    {
      logoMediaFileId: input.logoMediaFileId,
      bannerMediaFileId: input.bannerMediaFileId,
    },
    actorUserId,
  );

  let responseRecord = updated;
  if (mediaUrls.logoUrl || mediaUrls.bannerUrl) {
    const patched = await updateBrandById(brandId, {
      ...(mediaUrls.logoUrl ? { logoUrl: mediaUrls.logoUrl } : {}),
      ...(mediaUrls.bannerUrl ? { bannerUrl: mediaUrls.bannerUrl } : {}),
      updatedBy: actorId,
    });
    if (patched) {
      responseRecord = patched;
    }
  }

  await writeAuditLog({
    eventType: BRAND_AUDIT_EVENTS.BRAND_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'brand',
    entityId: responseRecord._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      brandId: updated._id.toString(),
    },
    status: 'success',
  });

  return toBrandResponse(responseRecord);
};

export const deleteBrand = async (brandId: string, actorUserId: string) => {
  const existing = await findBrandById(brandId);

  if (!existing) {
    throw new AppError({
      message: 'Brand not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: brandError(BRAND_ERROR_CODES.BRAND_NOT_FOUND),
    });
  }

  const productCount = await countActiveProductsByBrand();

  if (productCount > 0) {
    throw new AppError({
      message: 'Brand has active products and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: brandError(BRAND_ERROR_CODES.BRAND_HAS_ACTIVE_PRODUCTS),
    });
  }

  const actorId = Types.ObjectId.isValid(actorUserId) ? new Types.ObjectId(actorUserId) : null;

  const deleted = await softDeleteBrandById(brandId, actorId);

  if (!deleted) {
    throw new AppError({
      message: 'Brand not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: brandError(BRAND_ERROR_CODES.BRAND_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: BRAND_AUDIT_EVENTS.BRAND_DELETED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'brand',
    entityId: deleted._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      brandId: deleted._id.toString(),
    },
    status: 'success',
  });

  return toBrandResponse(deleted);
};
