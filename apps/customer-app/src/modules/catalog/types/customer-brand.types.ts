import type { CatalogStatus } from './customer-category.types';

export type CustomerBrand = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  status: CatalogStatus;
};
