export type CatalogStatus = 'active' | 'inactive' | 'archived';

export type CustomerCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentCategoryId: string | null;
  level: number;
  displayOrder: number;
  iconUrl: string | null;
  bannerUrl: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  status: CatalogStatus;
};
