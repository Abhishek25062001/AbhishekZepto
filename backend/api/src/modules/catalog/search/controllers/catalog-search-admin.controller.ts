import { sendPaginatedResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import type { FoodType } from '../../products/constants/food-type.constant';
import type { ProductApprovalStatus } from '../../products/constants/product-approval-status.constant';
import type { ProductStatus } from '../../products/constants/product-status.constant';
import type { ProductType } from '../../products/constants/product-type.constant';
import type { CatalogSortOption } from '../constants/catalog-sort.constant';
import { searchAdminProductsService } from '../services/catalog-search.service';
import type { AdminCatalogSearchQuery } from '../types/catalog-search.types';

const parseAdminQuery = (query: Record<string, unknown>): AdminCatalogSearchQuery => ({
  page: Number(query.page ?? 1),
  limit: Number(query.limit ?? 20),
  search: typeof query.search === 'string' ? query.search : undefined,
  categoryId: typeof query.categoryId === 'string' ? query.categoryId : undefined,
  subcategoryId: typeof query.subcategoryId === 'string' ? query.subcategoryId : undefined,
  brandId: typeof query.brandId === 'string' ? query.brandId : undefined,
  foodType: typeof query.foodType === 'string' ? (query.foodType as FoodType) : undefined,
  productType: typeof query.productType === 'string' ? (query.productType as ProductType) : undefined,
  approvalStatus:
    typeof query.approvalStatus === 'string'
      ? (query.approvalStatus as ProductApprovalStatus)
      : undefined,
  status: typeof query.status === 'string' ? (query.status as ProductStatus) : undefined,
  isVisible: typeof query.isVisible === 'boolean' ? query.isVisible : undefined,
  isFeatured: typeof query.isFeatured === 'boolean' ? query.isFeatured : undefined,
  sortBy: typeof query.sortBy === 'string' ? (query.sortBy as CatalogSortOption) : undefined,
  sortOrder: typeof query.sortOrder === 'string' ? (query.sortOrder as 'asc' | 'desc') : undefined,
});

export const listAdminCatalogProductsController = asyncHandler(async (req, res) => {
  const query = parseAdminQuery(req.query as Record<string, unknown>);
  const response = await searchAdminProductsService(query, {
    userId: req.user?.userId,
    role: req.user?.role ?? null,
  });

  return sendPaginatedResponse({
    res,
    message: 'Products fetched successfully',
    data: response.items,
    pagination: response.pagination,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
