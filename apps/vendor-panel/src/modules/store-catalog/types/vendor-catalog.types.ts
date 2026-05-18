export type CatalogStatus = 'active' | 'inactive' | 'archived';
export type ProductApprovalStatus = 'approved' | 'pending_review' | 'rejected' | 'draft' | 'archived';
export type FoodType = 'veg' | 'non_veg' | 'egg' | 'vegan' | null;
export type ProductType = 'grocery' | 'pharmacy' | 'general';

export type VendorCatalogCategory = {
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
  createdAt: string;
  updatedAt: string;
};

export type VendorCatalogBrand = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
};

export type VendorCatalogProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  categoryId: string;
  subcategoryId: string | null;
  brandId: string | null;
  productType: ProductType;
  foodType: FoodType;
  taxCategoryId: string | null;
  hsnCode: string | null;
  searchKeywords: string[];
  tags: string[];
  defaultImageUrl: string | null;
  imageUrls: string[];
  attributeSummary: Record<string, unknown> | null;
  isFeatured: boolean;
  isVisible: boolean;
  approvalStatus: ProductApprovalStatus;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
};

export type VendorCatalogProductVariant = {
  id: string;
  productId: string;
  variantName: string;
  sku: string;
  barcode: string | null;
  unit: string;
  unitValue: number;
  mrp: number;
  defaultSellingPrice: number;
  weightInGrams: number | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  imageUrl: string | null;
  attributeValues: Record<string, unknown> | null;
  isDefault: boolean;
  isVisible: boolean;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
};

export type VendorCatalogFacetBucket = {
  id: string;
  name: string;
  count: number;
};

export type VendorCatalogFacets = {
  categories: VendorCatalogFacetBucket[];
  brands: VendorCatalogFacetBucket[];
  foodTypes: Array<{ value: string; count: number }>;
  availability: Array<{ value: string; count: number }>;
};

export type VendorCatalogProductListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  foodType?: Exclude<FoodType, null>;
  status?: CatalogStatus;
  isVisible?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};
