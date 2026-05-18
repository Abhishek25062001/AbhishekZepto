import type { FoodType } from './customer-product.types';

export type CustomerCatalogAvailabilityFilter = 'available' | 'out_of_stock' | 'all';

export type CustomerCatalogSortBy =
  | 'relevance'
  | 'price_low_to_high'
  | 'price_high_to_low'
  | 'newest'
  | 'featured';

export type CustomerCatalogListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  q?: string;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  foodType?: Exclude<FoodType, null>;
  availability?: CustomerCatalogAvailabilityFilter;
  isAvailable?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: CustomerCatalogSortBy;
  sortOrder?: 'asc' | 'desc';
  cityId?: string;
  storeId?: string;
};

export type CustomerCatalogFacetBucket = {
  id: string;
  name: string;
  count: number;
};

export type CustomerCatalogFacets = {
  categories: CustomerCatalogFacetBucket[];
  brands: CustomerCatalogFacetBucket[];
  foodTypes: Array<{ value: string; count: number }>;
  availability: Array<{ value: string; count: number }>;
};
