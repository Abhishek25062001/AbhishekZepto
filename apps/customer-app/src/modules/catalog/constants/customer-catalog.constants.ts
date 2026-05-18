import type {
  CustomerCatalogAvailabilityFilter,
  CustomerCatalogSortBy,
} from '../types/customer-catalog-query.types';
import type { FoodType } from '../types/customer-product.types';

export const CUSTOMER_CATALOG_SORT_OPTIONS: CustomerCatalogSortBy[] = [
  'relevance',
  'price_low_to_high',
  'price_high_to_low',
  'newest',
  'featured',
];

export const CUSTOMER_CATALOG_SORT_LABELS: Record<CustomerCatalogSortBy, string> = {
  relevance: 'Relevance',
  price_low_to_high: 'Price: Low to High',
  price_high_to_low: 'Price: High to Low',
  newest: 'Newest',
  featured: 'Featured',
};

export const CUSTOMER_FOOD_TYPE_OPTIONS: Exclude<FoodType, null>[] = [
  'veg',
  'non_veg',
  'egg',
  'not_applicable',
];

export const CUSTOMER_FOOD_TYPE_LABELS: Record<Exclude<FoodType, null>, string> = {
  veg: 'Veg',
  non_veg: 'Non-Veg',
  egg: 'Egg',
  not_applicable: 'N/A',
};

export const CUSTOMER_AVAILABILITY_OPTIONS: CustomerCatalogAvailabilityFilter[] = [
  'all',
  'available',
  'out_of_stock',
];

export const CUSTOMER_AVAILABILITY_LABELS: Record<
  CustomerCatalogAvailabilityFilter,
  string
> = {
  all: 'All',
  available: 'Available',
  out_of_stock: 'Out of Stock',
};

export const CUSTOMER_CATALOG_SEARCH_DEBOUNCE_MS = 300;
export const CUSTOMER_CATALOG_SEARCH_MIN_LENGTH = 2;
export const CUSTOMER_RECENTLY_VIEWED_MAX = 10;
