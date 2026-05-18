import { Types } from 'mongoose';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { writeAuditLog } from '../../../audit';
import { CATEGORY_AUDIT_EVENTS } from '../constants/category-audit-events.constant';
import { CATEGORY_ERROR_CODES, type CategoryErrorCode } from '../constants/category-error-codes.constant';

const categoryError = (code: CategoryErrorCode): ErrorCode => ERROR_CODES[code];
import type { CategoryRecord } from '../models/category.model';
import {
  countChildCategories,
  createCategory as createCategoryRecord,
  findCategoryById,
  findCategoryBySlug,
  listCategories as listCategoriesRecord,
  softDeleteCategoryById,
  updateCategoryById,
} from '../repositories/category.repository';
import type {
  CategoryListQuery,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../types/category.types';
import { attachCategoryMedia } from '../../../media/utils/catalog-media-attachment.util';
import { toCategoryResponse } from '../utils/category-response.mapper';
import {
  assertCategoryLevelWithinLimit,
  resolveCategoryLevel,
} from '../utils/category-level.util';
import { generateCategorySlug, normalizeCategorySlug } from '../utils/category-slug.util';

const countActiveProductsForCategory = async (): Promise<number> => {
  // Product Management Backend will wire real product dependency checks.
  return 0;
};

const resolveParentCategory = async (
  parentCategoryId: string | null | undefined,
): Promise<(CategoryRecord & { _id: Types.ObjectId }) | null> => {
  if (!parentCategoryId) {
    return null;
  }

  const parent = await findCategoryById(parentCategoryId);

  if (!parent) {
    throw new AppError({
      message: 'Parent category not found',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: categoryError(CATEGORY_ERROR_CODES.INVALID_PARENT_CATEGORY),
    });
  }

  if (parent.status !== 'active') {
    throw new AppError({
      message: 'Parent category must be active',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: categoryError(CATEGORY_ERROR_CODES.INVALID_PARENT_CATEGORY),
    });
  }

  return parent;
};

const resolveSlugForCreate = async (name: string, slug?: string): Promise<string> => {
  const resolvedSlug = normalizeCategorySlug(slug ?? generateCategorySlug(name));

  if (!resolvedSlug) {
    throw new AppError({
      message: 'Category slug is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findCategoryBySlug(resolvedSlug);

  if (existing) {
    throw new AppError({
      message: 'Category slug already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: categoryError(CATEGORY_ERROR_CODES.CATEGORY_SLUG_ALREADY_EXISTS),
    });
  }

  return resolvedSlug;
};

const resolveSlugForUpdate = async (
  categoryId: string,
  name: string,
  currentSlug: string,
  slug?: string,
): Promise<string> => {
  const resolvedSlug = slug ? normalizeCategorySlug(slug) : currentSlug;

  if (!resolvedSlug) {
    throw new AppError({
      message: 'Category slug is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findCategoryBySlug(resolvedSlug, categoryId);

  if (existing) {
    throw new AppError({
      message: 'Category slug already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: categoryError(CATEGORY_ERROR_CODES.CATEGORY_SLUG_ALREADY_EXISTS),
    });
  }

  if (!slug && name) {
    return currentSlug;
  }

  return resolvedSlug;
};

const buildLevelFromParent = (parent: (CategoryRecord & { _id: Types.ObjectId }) | null): number => {
  const level = resolveCategoryLevel(parent ? parent.level : null);

  try {
    assertCategoryLevelWithinLimit(level);
  } catch {
    throw new AppError({
      message: 'Category hierarchy cannot exceed two levels',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: categoryError(CATEGORY_ERROR_CODES.CATEGORY_LEVEL_LIMIT_EXCEEDED),
    });
  }

  return level;
};

export const listCategories = async (query: CategoryListQuery) => {
  const response = await listCategoriesRecord(query);

  return {
    items: response.items.map(toCategoryResponse),
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

export const getCategoryById = async (categoryId: string) => {
  const category = await findCategoryById(categoryId);

  if (!category) {
    throw new AppError({
      message: 'Category not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: categoryError(CATEGORY_ERROR_CODES.CATEGORY_NOT_FOUND),
    });
  }

  return toCategoryResponse(category);
};

export const createCategory = async (
  input: CreateCategoryInput,
  actorUserId: string,
) => {
  const parent = await resolveParentCategory(input.parentCategoryId ?? null);
  const level = buildLevelFromParent(parent);
  const slug = await resolveSlugForCreate(input.name, input.slug);
  const actorId = Types.ObjectId.isValid(actorUserId)
    ? new Types.ObjectId(actorUserId)
    : null;

  const created = await createCategoryRecord({
    name: input.name.trim(),
    slug,
    description: input.description ?? null,
    parentCategoryId: parent ? parent._id : null,
    level,
    displayOrder: input.displayOrder ?? 0,
    iconUrl: input.iconUrl ?? null,
    bannerUrl: input.bannerUrl ?? null,
    isFeatured: input.isFeatured ?? false,
    isVisible: input.isVisible ?? true,
    status: input.status ?? 'active',
    createdBy: actorId,
    updatedBy: actorId,
  });

  const mediaUrls = await attachCategoryMedia(
    created._id.toString(),
    {
      iconMediaFileId: input.iconMediaFileId,
      bannerMediaFileId: input.bannerMediaFileId,
    },
    actorUserId,
  );

  let responseRecord = created;
  if (mediaUrls.iconUrl || mediaUrls.bannerUrl) {
    const patched = await updateCategoryById(created._id.toString(), {
      ...(mediaUrls.iconUrl ? { iconUrl: mediaUrls.iconUrl } : {}),
      ...(mediaUrls.bannerUrl ? { bannerUrl: mediaUrls.bannerUrl } : {}),
      updatedBy: actorId,
    });
    if (patched) {
      responseRecord = patched;
    }
  }

  await writeAuditLog({
    eventType: CATEGORY_AUDIT_EVENTS.CATEGORY_CREATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'category',
    entityId: responseRecord._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      categoryId: responseRecord._id.toString(),
      slug: responseRecord.slug,
    },
    status: 'success',
  });

  return toCategoryResponse(responseRecord);
};

export const updateCategory = async (
  categoryId: string,
  input: UpdateCategoryInput,
  actorUserId: string,
) => {
  const existing = await findCategoryById(categoryId);

  if (!existing) {
    throw new AppError({
      message: 'Category not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: categoryError(CATEGORY_ERROR_CODES.CATEGORY_NOT_FOUND),
    });
  }

  const parent =
    input.parentCategoryId !== undefined
      ? await resolveParentCategory(input.parentCategoryId)
      : existing.parentCategoryId
        ? await findCategoryById(existing.parentCategoryId.toString())
        : null;

  if (parent && parent._id.toString() === categoryId) {
    throw new AppError({
      message: 'Category cannot be its own parent',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: categoryError(CATEGORY_ERROR_CODES.INVALID_PARENT_CATEGORY),
    });
  }

  const level =
    input.parentCategoryId !== undefined ? buildLevelFromParent(parent) : existing.level;

  const slug = await resolveSlugForUpdate(
    categoryId,
    input.name ?? existing.name,
    existing.slug,
    input.slug,
  );

  const actorId = Types.ObjectId.isValid(actorUserId)
    ? new Types.ObjectId(actorUserId)
    : null;

  const updated = await updateCategoryById(categoryId, {
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    slug,
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.parentCategoryId !== undefined
      ? { parentCategoryId: parent ? parent._id : null, level }
      : {}),
    ...(input.displayOrder !== undefined ? { displayOrder: input.displayOrder } : {}),
    ...(input.iconUrl !== undefined ? { iconUrl: input.iconUrl } : {}),
    ...(input.bannerUrl !== undefined ? { bannerUrl: input.bannerUrl } : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
    ...(input.isVisible !== undefined ? { isVisible: input.isVisible } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    updatedBy: actorId,
  });

  if (!updated) {
    throw new AppError({
      message: 'Category not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: categoryError(CATEGORY_ERROR_CODES.CATEGORY_NOT_FOUND),
    });
  }

  const mediaUrls = await attachCategoryMedia(
    categoryId,
    {
      iconMediaFileId: input.iconMediaFileId,
      bannerMediaFileId: input.bannerMediaFileId,
    },
    actorUserId,
  );

  let responseRecord = updated;
  if (mediaUrls.iconUrl || mediaUrls.bannerUrl) {
    const patched = await updateCategoryById(categoryId, {
      ...(mediaUrls.iconUrl ? { iconUrl: mediaUrls.iconUrl } : {}),
      ...(mediaUrls.bannerUrl ? { bannerUrl: mediaUrls.bannerUrl } : {}),
      updatedBy: actorId,
    });
    if (patched) {
      responseRecord = patched;
    }
  }

  await writeAuditLog({
    eventType: CATEGORY_AUDIT_EVENTS.CATEGORY_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'category',
    entityId: responseRecord._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      categoryId: updated._id.toString(),
    },
    status: 'success',
  });

  return toCategoryResponse(responseRecord);
};

export const deleteCategory = async (categoryId: string, actorUserId: string) => {
  const existing = await findCategoryById(categoryId);

  if (!existing) {
    throw new AppError({
      message: 'Category not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: categoryError(CATEGORY_ERROR_CODES.CATEGORY_NOT_FOUND),
    });
  }

  const childCount = await countChildCategories(categoryId);

  if (childCount > 0) {
    throw new AppError({
      message: 'Category has child categories and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: categoryError(CATEGORY_ERROR_CODES.CATEGORY_HAS_CHILDREN),
    });
  }

  const productCount = await countActiveProductsForCategory();

  if (productCount > 0) {
    throw new AppError({
      message: 'Category has active products and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: categoryError(CATEGORY_ERROR_CODES.CATEGORY_HAS_ACTIVE_PRODUCTS),
    });
  }

  const actorId = Types.ObjectId.isValid(actorUserId)
    ? new Types.ObjectId(actorUserId)
    : null;

  const deleted = await softDeleteCategoryById(categoryId, actorId);

  if (!deleted) {
    throw new AppError({
      message: 'Category not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: categoryError(CATEGORY_ERROR_CODES.CATEGORY_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: CATEGORY_AUDIT_EVENTS.CATEGORY_DELETED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'category',
    entityId: deleted._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      categoryId: deleted._id.toString(),
    },
    status: 'success',
  });

  return toCategoryResponse(deleted);
};
