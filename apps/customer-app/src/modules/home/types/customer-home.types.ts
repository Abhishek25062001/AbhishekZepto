import type { CustomerCategory } from '../../catalog/types/customer-category.types';
import type { CustomerProduct } from '../../catalog/types/customer-product.types';

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

export type CustomerHomeFeed = {
  store: HomeStoreSummary;
  serviceability: HomeServiceabilityBlock;
  categories: HomePaginatedSection<CustomerCategory>;
  featuredProducts: HomePaginatedSection<CustomerProduct>;
  banners: [];
};

export type CustomerHomeQuery = {
  storeId: string;
  cityId?: string;
  categoryLimit?: number;
  featuredLimit?: number;
};
