import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { ProductModel, type ProductRecord } from '../models/product.model';
import type { ProductListQuery } from '../types/product.types';

const notDeletedFilter = { isDeleted: false };

export const findProductById = async (
  productId: string,
): Promise<(ProductRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(productId)) {
    return null;
  }

  return ProductModel.findOne({
    _id: new Types.ObjectId(productId),
    ...notDeletedFilter,
  }).lean();
};

export const findProductBySlug = async (
  slug: string,
  excludeId?: string,
): Promise<(ProductRecord & { _id: Types.ObjectId }) | null> => {
  const filter: FilterQuery<ProductRecord> = {
    slug,
    ...notDeletedFilter,
  };

  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new Types.ObjectId(excludeId) };
  }

  return ProductModel.findOne(filter).lean();
};

export const createProduct = async (
  payload: Partial<ProductRecord>,
): Promise<ProductRecord & { _id: Types.ObjectId }> => {
  const created = await ProductModel.create(payload);
  return created.toObject() as ProductRecord & { _id: Types.ObjectId };
};

export const updateProductById = async (
  productId: string,
  payload: Partial<ProductRecord>,
): Promise<(ProductRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(productId)) {
    return null;
  }

  return ProductModel.findOneAndUpdate(
    { _id: new Types.ObjectId(productId), ...notDeletedFilter },
    { $set: payload },
    { new: true },
  ).lean();
};

export const softDeleteProductById = async (
  productId: string,
  updatedBy: Types.ObjectId | null,
): Promise<(ProductRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(productId)) {
    return null;
  }

  return ProductModel.findOneAndUpdate(
    { _id: new Types.ObjectId(productId), ...notDeletedFilter },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        status: 'archived',
        approvalStatus: 'archived',
        updatedBy,
      },
    },
    { new: true },
  ).lean();
};

export const listProducts = async (
  query: ProductListQuery,
): Promise<{
  items: (ProductRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  const filter: FilterQuery<ProductRecord> = { ...notDeletedFilter };

  if (query.categoryId && Types.ObjectId.isValid(query.categoryId)) {
    filter.categoryId = new Types.ObjectId(query.categoryId);
  }

  if (query.subcategoryId && Types.ObjectId.isValid(query.subcategoryId)) {
    filter.subcategoryId = new Types.ObjectId(query.subcategoryId);
  }

  if (query.brandId && Types.ObjectId.isValid(query.brandId)) {
    filter.brandId = new Types.ObjectId(query.brandId);
  }

  if (query.approvalStatus) {
    filter.approvalStatus = query.approvalStatus;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (typeof query.isVisible === 'boolean') {
    filter.isVisible = query.isVisible;
  }

  if (typeof query.isFeatured === 'boolean') {
    filter.isFeatured = query.isFeatured;
  }

  if (query.foodType) {
    filter.foodType = query.foodType;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [
      { name: searchRegex },
      { slug: searchRegex },
      { searchKeywords: searchRegex },
    ];
  }

  const sortField = query.sortBy ?? 'createdAt';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    ProductModel.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    ProductModel.countDocuments(filter),
  ]);

  return {
    items: items as (ProductRecord & { _id: Types.ObjectId })[],
    total,
  };
};

export const countActiveProductsByCategory = async (categoryId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(categoryId)) {
    return 0;
  }

  const objectId = new Types.ObjectId(categoryId);

  return ProductModel.countDocuments({
    ...notDeletedFilter,
    status: { $ne: 'archived' },
    $or: [{ categoryId: objectId }, { subcategoryId: objectId }],
  });
};

export const countActiveProductsByBrand = async (brandId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(brandId)) {
    return 0;
  }

  return ProductModel.countDocuments({
    brandId: new Types.ObjectId(brandId),
    ...notDeletedFilter,
    status: { $ne: 'archived' },
  });
};
