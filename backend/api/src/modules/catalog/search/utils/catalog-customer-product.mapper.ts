import type { Types } from 'mongoose';
import type { ProductRecord } from '../../products/models/product.model';
import type { ProductVariantRecord } from '../../variants/models/product-variant.model';

export type CustomerCatalogStoreContext = {
  storeProductId: string;
  variantId: string;
  mrp: number;
  sellingPrice: number;
  finalPrice: number;
  discountType: string;
  discountValue: number;
  isAvailable: boolean;
  isOutOfStock: boolean;
  availableQuantity: number;
  isLowStock: boolean;
};

type ProductLean = ProductRecord & { _id: Types.ObjectId };
type VariantLean = ProductVariantRecord & { _id: Types.ObjectId };

export const mapCustomerProductDetail = (
  product: ProductLean,
  storeContext?: CustomerCatalogStoreContext | null,
) => ({
  id: product._id.toString(),
  name: product.name,
  slug: product.slug,
  description: product.description,
  shortDescription: product.shortDescription,
  categoryId: product.categoryId.toString(),
  subcategoryId: product.subcategoryId ? product.subcategoryId.toString() : null,
  brandId: product.brandId ? product.brandId.toString() : null,
  productType: product.productType,
  foodType: product.foodType,
  taxCategoryId: product.taxCategoryId ? product.taxCategoryId.toString() : null,
  hsnCode: product.hsnCode,
  searchKeywords: product.searchKeywords,
  tags: product.tags,
  defaultImageUrl: product.defaultImageUrl,
  imageUrls: product.imageUrls,
  attributeSummary: product.attributeSummary,
  isFeatured: product.isFeatured,
  isVisible: product.isVisible,
  approvalStatus: product.approvalStatus,
  status: product.status,
  storeProductId: storeContext?.storeProductId ?? null,
  variantId: storeContext?.variantId ?? null,
  mrp: storeContext?.mrp ?? null,
  sellingPrice: storeContext?.sellingPrice ?? null,
  discountType: storeContext?.discountType ?? null,
  discountValue: storeContext?.discountValue ?? null,
  finalPrice: storeContext?.finalPrice ?? null,
  isAvailable: storeContext?.isAvailable ?? null,
  isOutOfStock: storeContext?.isOutOfStock ?? null,
  availableQuantity: storeContext?.availableQuantity ?? null,
});

export const mapCustomerProductVariant = (variant: VariantLean) => ({
  id: variant._id.toString(),
  productId: variant.productId.toString(),
  variantName: variant.variantName,
  sku: variant.sku,
  barcode: variant.barcode,
  unit: variant.unit,
  unitValue: variant.unitValue,
  mrp: variant.mrp,
  defaultSellingPrice: variant.defaultSellingPrice ?? variant.mrp,
  weightInGrams: variant.weightInGrams,
  lengthCm: variant.lengthCm,
  widthCm: variant.widthCm,
  heightCm: variant.heightCm,
  imageUrl: variant.imageUrl,
  attributeValues: variant.attributeValues,
  isDefault: variant.isDefault,
  isVisible: variant.isVisible,
  status: variant.status,
});
