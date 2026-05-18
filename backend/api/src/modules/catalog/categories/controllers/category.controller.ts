import { sendCreatedResponse, sendPaginatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from '../services/category.service';
import type { CategoryListQuery, CategoryStatus } from '../types/category.types';

const parseCategoryListQuery = (query: Record<string, unknown>): CategoryListQuery => ({
  page: typeof query.page === 'number' ? query.page : Number(query.page ?? 1),
  limit: typeof query.limit === 'number' ? query.limit : Number(query.limit ?? 20),
  parentCategoryId:
    typeof query.parentCategoryId === 'string' ? query.parentCategoryId : undefined,
  status: typeof query.status === 'string' ? (query.status as CategoryStatus) : undefined,
  isVisible: typeof query.isVisible === 'boolean' ? query.isVisible : undefined,
  isFeatured: typeof query.isFeatured === 'boolean' ? query.isFeatured : undefined,
  search: typeof query.search === 'string' ? query.search : undefined,
  sortBy:
    typeof query.sortBy === 'string'
      ? (query.sortBy as CategoryListQuery['sortBy'])
      : undefined,
  sortOrder:
    typeof query.sortOrder === 'string'
      ? (query.sortOrder as CategoryListQuery['sortOrder'])
      : undefined,
});

const requireStringParam = (value: string | string[] | undefined): string => {
  if (typeof value === 'string') {
    return value;
  }

  return '';
};

const requireActorUserId = (userId?: string): string => {
  if (!userId) {
    return '';
  }

  return userId;
};

export const listCategoriesController = asyncHandler(async (req, res) => {
  const query = parseCategoryListQuery(req.query as Record<string, unknown>);

  const response = await listCategories(query);

  return sendPaginatedResponse({
    res,
    message: 'Categories fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const createCategoryController = asyncHandler(async (req, res) => {
  const response = await createCategory(req.body, requireActorUserId(req.user?.userId));

  return sendCreatedResponse({
    res,
    message: 'Category created successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const getCategoryByIdController = asyncHandler(async (req, res) => {
  const response = await getCategoryById(requireStringParam(req.params.categoryId));

  return sendSuccessResponse({
    res,
    message: 'Category fetched successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const updateCategoryController = asyncHandler(async (req, res) => {
  const response = await updateCategory(
    requireStringParam(req.params.categoryId),
    req.body,
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Category updated successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});

export const deleteCategoryController = asyncHandler(async (req, res) => {
  const response = await deleteCategory(
    requireStringParam(req.params.categoryId),
    requireActorUserId(req.user?.userId),
  );

  return sendSuccessResponse({
    res,
    message: 'Category deleted successfully',
    data: response,
    meta: {
      requestId: req.requestId,
      traceId: req.traceId,
    },
  });
});
