import type { CategoryResponse } from '../../catalog/categories/types/category.types';

export type CustomerHomeQuery = {
  storeId: string;
  cityId?: string;
  categoryLimit?: number;
  featuredLimit?: number;
};

export type HomeStoreSummary = {
  id: string;
  name: string;
  cityId: string;
  code: string;
  isOpen: boolean;
  isAcceptingOrders: boolean;
};

export type HomeServiceabilityBlock = {
  isServiceable: boolean;
  message: string | null;
};

export type HomeProductCard = {
  id: string;
  storeProductId: string;
  productId: string;
  variantId: string | null;
  name: string;
  shortDescription: string | null;
  category: string | null;
  brand: string | null;
  categoryId: string | null;
  brandId: string | null;
  defaultImageUrl: string | null;
  foodType: string | null;
  mrp: number;
  sellingPrice: number;
  finalPrice: number;
  discountType: string | null;
  discountValue: number | null;
  isAvailable: boolean;
  isOutOfStock: boolean;
  availableQuantity: number;
  isLowStock: boolean;
};

export type HomePaginatedSection<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type CustomerHomeFeedResponse = {
  store: HomeStoreSummary;
  serviceability: HomeServiceabilityBlock;
  categories: HomePaginatedSection<CategoryResponse>;
  featuredProducts: HomePaginatedSection<HomeProductCard>;
  banners: [];
};

export type CustomerHomeAuditContext = {
  actorId: string;
  requestId?: string | null;
  traceId?: string | null;
};
