import type { FilterQuery, PipelineStage } from 'mongoose';
import { Types } from 'mongoose';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import { BrandModel, type BrandRecord } from '../../brands/models/brand.model';
import { CategoryModel, type CategoryRecord } from '../../categories/models/category.model';
import { ProductModel, type ProductRecord } from '../../products/models/product.model';
import {
  ProductVariantModel,
  type ProductVariantRecord,
} from '../../variants/models/product-variant.model';
import { InventoryStockModel } from '../../../inventory/models/inventory-stock.model';
import { StoreProductModel, type StoreProductRecord } from '../../../store-products/models/store-product.model';
import {
  buildStoreProductBaseMatch,
  customerCatalogProductVisibilityFilter,
  customerCatalogVariantVisibilityFilter,
} from '../utils/catalog-filter.util';
import type { CustomerCatalogStoreContext } from '../utils/catalog-customer-product.mapper';
import type {
  AdminCatalogSearchQuery,
  AdminCatalogSearchItem,
  CatalogFacetQuery,
  CatalogFacetResult,
  CustomerBrandBrowseQuery,
  CustomerCatalogListQuery,
  CustomerCatalogSearchItem,
  CustomerCategoryBrowseQuery,
  CustomerScope,
  PaginatedCatalogResult,
  TenantScope,
  VendorCatalogSearchItem,
  VendorCatalogSearchQuery,
} from '../types/catalog-search.types';
import {
  buildAdminProductFilters,
  buildCustomerProductFilters,
  buildVendorProductFilters,
} from '../utils/catalog-filter.util';
import { buildAdminProductSort, buildCatalogSort } from '../utils/catalog-sort.util';

const prefixProductMatch = (productMatch: FilterQuery<ProductRecord>): FilterQuery<Record<string, unknown>> => {
  const prefixed: FilterQuery<Record<string, unknown>> = {};

  for (const [key, value] of Object.entries(productMatch)) {
    if (key === '$or' && Array.isArray(value)) {
      prefixed.$or = value.map((clause) => {
        const entry: Record<string, unknown> = {};
        for (const [innerKey, innerValue] of Object.entries(clause as Record<string, unknown>)) {
          entry[`product.${innerKey}`] = innerValue;
        }
        return entry;
      });
      continue;
    }

    prefixed[`product.${key}`] = value;
  }

  return prefixed;
};

const paginate = (page: number, limit: number) => ({
  skip: (page - 1) * limit,
  limit,
});

const loadCategoryBrandMaps = async (items: Array<{ categoryId: Types.ObjectId; brandId: Types.ObjectId | null }>) => {
  const categoryIds = [...new Set(items.map((item) => item.categoryId.toString()))];
  const brandIds = [
    ...new Set(items.filter((item) => item.brandId).map((item) => item.brandId!.toString())),
  ];

  const [categories, brands] = await Promise.all([
    CategoryModel.find({ _id: { $in: categoryIds } }).select({ name: 1 }).lean(),
    brandIds.length > 0
      ? BrandModel.find({ _id: { $in: brandIds } }).select({ name: 1 }).lean()
      : Promise.resolve([]),
  ]);

  const categoryMap = new Map(categories.map((c) => [c._id.toString(), c.name]));
  const brandMap = new Map(brands.map((b) => [b._id.toString(), b.name]));

  return { categoryMap, brandMap };
};

const runStoreProductSearch = async (
  storeProductMatch: FilterQuery<StoreProductRecord>,
  productMatch: FilterQuery<ProductRecord>,
  sort: Record<string, 1 | -1>,
  page: number,
  limit: number,
  requireInStock: boolean,
): Promise<{ rows: Array<Record<string, unknown>>; total: number }> => {
  const { skip, limit: pageLimit } = paginate(page, limit);

  const pipeline: PipelineStage[] = [
    { $match: storeProductMatch },
    {
      $lookup: {
        from: COLLECTION_NAMES.PRODUCTS,
        localField: 'productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    { $match: prefixProductMatch(productMatch) },
    {
      $lookup: {
        from: COLLECTION_NAMES.INVENTORY_STOCKS,
        localField: '_id',
        foreignField: 'storeProductId',
        as: 'stock',
      },
    },
    {
      $unwind: {
        path: '$stock',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        $or: [{ stock: { $exists: false } }, { 'stock.isDeleted': false, 'stock.status': 'active' }],
      },
    },
  ];

  if (requireInStock) {
    pipeline.push({
      $match: {
        $or: [{ 'stock.isOutOfStock': false }, { stock: { $exists: false } }],
      },
    });
  }

  const countPipeline: PipelineStage[] = [...pipeline, { $count: 'total' }];
  const dataPipeline: PipelineStage[] = [
    ...pipeline,
    { $sort: sort },
    { $skip: skip },
    { $limit: pageLimit },
  ];

  const [countResult, rows] = await Promise.all([
    StoreProductModel.aggregate<{ total: number }>(countPipeline),
    StoreProductModel.aggregate<Record<string, unknown>>(dataPipeline),
  ]);

  return {
    rows,
    total: countResult[0]?.total ?? 0,
  };
};

export const searchAdminProducts = async (
  query: AdminCatalogSearchQuery,
): Promise<PaginatedCatalogResult<AdminCatalogSearchItem>> => {
  const filter = buildAdminProductFilters(query);
  const sort = buildAdminProductSort(query.sortBy, query.sortOrder);
  const { skip, limit } = paginate(query.page, query.limit);

  const [items, total] = await Promise.all([
    ProductModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    ProductModel.countDocuments(filter),
  ]);

  const { categoryMap, brandMap } = await loadCategoryBrandMaps(
    items as Array<{ categoryId: Types.ObjectId; brandId: Types.ObjectId | null }>,
  );

  return {
    items: items.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId.toString(),
      subcategoryId: product.subcategoryId ? product.subcategoryId.toString() : null,
      brandId: product.brandId ? product.brandId.toString() : null,
      categoryName: categoryMap.get(product.categoryId.toString()) ?? null,
      brandName: product.brandId ? brandMap.get(product.brandId.toString()) ?? null : null,
      productType: product.productType,
      foodType: product.foodType,
      approvalStatus: product.approvalStatus,
      status: product.status,
      isVisible: product.isVisible,
      isFeatured: product.isFeatured,
      defaultImageUrl: product.defaultImageUrl,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    })),
    total,
  };
};

export const searchVendorProducts = async (
  query: VendorCatalogSearchQuery,
  tenantScope: TenantScope,
): Promise<PaginatedCatalogResult<VendorCatalogSearchItem>> => {
  const { storeProductMatch, productMatch } = buildVendorProductFilters(query, tenantScope);
  const sort = buildCatalogSort(query.sortBy, query.sortOrder, 'vendor');

  const { rows, total } = await runStoreProductSearch(
    storeProductMatch,
    productMatch,
    sort,
    query.page,
    query.limit,
    false,
  );

  return {
    items: rows.map((row) => {
      const product = row.product as ProductRecord & { _id: Types.ObjectId };
      return {
        id: product._id.toString(),
        storeProductId: (row._id as Types.ObjectId).toString(),
        productId: product._id.toString(),
        variantId: (row.variantId as Types.ObjectId).toString(),
        name: product.name,
        sku: row.sku as string,
        storeSku: (row.storeSku as string | null) ?? null,
        categoryId: (row.categoryId as Types.ObjectId).toString(),
        brandId: row.brandId ? (row.brandId as Types.ObjectId).toString() : null,
        mrp: row.mrp as number,
        sellingPrice: row.sellingPrice as number,
        finalPrice: row.finalPrice as number,
        isAvailable: row.isAvailable as boolean,
        isVisible: row.isVisible as boolean,
        status: row.status as string,
      };
    }),
    total,
  };
};

export const searchCustomerProducts = async (
  query: CustomerCatalogListQuery,
  customerScope: CustomerScope,
): Promise<PaginatedCatalogResult<CustomerCatalogSearchItem>> => {
  const { storeProductMatch, productMatch, requireInStock } = buildCustomerProductFilters(
    query,
    customerScope,
  );
  const sort = buildCatalogSort(query.sortBy, query.sortOrder, 'customer');

  const { rows, total } = await runStoreProductSearch(
    storeProductMatch,
    productMatch,
    sort,
    query.page,
    query.limit,
    requireInStock,
  );

  const mappedItems = rows.map((row) => {
    const product = row.product as ProductRecord & { _id: Types.ObjectId };
    const stock = row.stock as
      | {
          availableQuantity?: number;
          isOutOfStock?: boolean;
          isLowStock?: boolean;
        }
      | undefined;

    return {
      categoryId: product.categoryId,
      brandId: product.brandId,
      item: {
        id: product._id.toString(),
        storeProductId: (row._id as Types.ObjectId).toString(),
        productId: product._id.toString(),
        variantId: (row.variantId as Types.ObjectId).toString(),
        name: product.name,
        shortDescription: product.shortDescription,
        categoryId: product.categoryId.toString(),
        brandId: product.brandId ? product.brandId.toString() : null,
        categoryName: null as string | null,
        brandName: null as string | null,
        defaultImageUrl: product.defaultImageUrl,
        foodType: product.foodType,
        mrp: row.mrp as number,
        sellingPrice: row.sellingPrice as number,
        finalPrice: row.finalPrice as number,
        discountType: row.discountType as string,
        discountValue: row.discountValue as number,
        isAvailable: row.isAvailable as boolean,
        isOutOfStock: stock?.isOutOfStock ?? false,
        availableQuantity: stock?.availableQuantity ?? 0,
        isLowStock: stock?.isLowStock ?? false,
      },
    };
  });

  const { categoryMap, brandMap } = await loadCategoryBrandMaps(
    mappedItems.map((entry) => ({
      categoryId: entry.categoryId,
      brandId: entry.brandId,
    })),
  );

  return {
    items: mappedItems.map((entry) => ({
      ...entry.item,
      categoryName: categoryMap.get(entry.item.categoryId) ?? null,
      brandName: entry.item.brandId ? brandMap.get(entry.item.brandId) ?? null : null,
    })),
    total,
  };
};

export const getCustomerFeaturedProducts = async (
  query: CustomerCatalogListQuery,
  customerScope: CustomerScope,
): Promise<PaginatedCatalogResult<CustomerCatalogSearchItem>> => {
  return searchCustomerProducts({ ...query, isFeatured: true }, customerScope);
};

const countFacetGroups = async (
  storeProductMatch: FilterQuery<StoreProductRecord>,
  productMatch: FilterQuery<ProductRecord>,
): Promise<CatalogFacetResult> => {
  const { rows } = await runStoreProductSearch(
    storeProductMatch,
    productMatch,
    { 'product.createdAt': -1 },
    1,
    500,
    false,
  );

  const categoryCounts = new Map<string, { name: string; count: number }>();
  const brandCounts = new Map<string, { name: string; count: number }>();
  const foodTypeCounts = new Map<string, number>();
  let availableCount = 0;
  let outOfStockCount = 0;

  for (const row of rows) {
    const product = row.product as ProductRecord;
    const stock = row.stock as { isOutOfStock?: boolean } | undefined;
    const categoryId = (row.categoryId as Types.ObjectId).toString();
    categoryCounts.set(categoryId, {
      name: categoryId,
      count: (categoryCounts.get(categoryId)?.count ?? 0) + 1,
    });

    if (row.brandId) {
      const brandId = (row.brandId as Types.ObjectId).toString();
      brandCounts.set(brandId, {
        name: brandId,
        count: (brandCounts.get(brandId)?.count ?? 0) + 1,
      });
    }

    if (product.foodType) {
      foodTypeCounts.set(product.foodType, (foodTypeCounts.get(product.foodType) ?? 0) + 1);
    }

    if (stock?.isOutOfStock) {
      outOfStockCount += 1;
    } else {
      availableCount += 1;
    }
  }

  const categoryIds = [...categoryCounts.keys()];
  const brandIds = [...brandCounts.keys()];
  const [categories, brands] = await Promise.all([
    CategoryModel.find({ _id: { $in: categoryIds } }).select({ name: 1 }).lean(),
    brandIds.length > 0
      ? BrandModel.find({ _id: { $in: brandIds } }).select({ name: 1 }).lean()
      : Promise.resolve([]),
  ]);

  return {
    categories: categories.map((category) => ({
      id: category._id.toString(),
      name: category.name,
      count: categoryCounts.get(category._id.toString())?.count ?? 0,
    })),
    brands: brands.map((brand) => ({
      id: brand._id.toString(),
      name: brand.name,
      count: brandCounts.get(brand._id.toString())?.count ?? 0,
    })),
    foodTypes: [...foodTypeCounts.entries()].map(([value, count]) => ({ value, count })),
    availability: [
      { value: 'available', count: availableCount },
      { value: 'out_of_stock', count: outOfStockCount },
    ],
  };
};

export const getCatalogFacets = async (
  query: CatalogFacetQuery,
  surface: 'vendor' | 'customer',
  scope: TenantScope | CustomerScope,
): Promise<CatalogFacetResult> => {
  if (surface === 'vendor') {
    const { storeProductMatch, productMatch } = buildVendorProductFilters(
      {
        page: 1,
        limit: 1,
        search: query.search,
        categoryId: query.categoryId,
        subcategoryId: query.subcategoryId,
        brandId: query.brandId,
        foodType: query.foodType,
        status: query.status,
        isAvailable: query.isAvailable,
      },
      scope as TenantScope,
    );
    return countFacetGroups(storeProductMatch, productMatch);
  }

  const { storeProductMatch, productMatch } = buildCustomerProductFilters(
    {
      page: 1,
      limit: 1,
      search: query.search,
      categoryId: query.categoryId,
      subcategoryId: query.subcategoryId,
      brandId: query.brandId,
      foodType: query.foodType,
      cityId: query.cityId,
      storeId: query.storeId,
    },
    scope as CustomerScope,
  );

  return countFacetGroups(storeProductMatch, productMatch);
};

const customerCatalogVisibilityFilter = {
  status: 'active' as const,
  isVisible: true,
  isDeleted: false,
};

export const listCustomerCategories = async (
  query: CustomerCategoryBrowseQuery,
): Promise<PaginatedCatalogResult<CategoryRecord & { _id: Types.ObjectId }>> => {
  const filter: FilterQuery<CategoryRecord> = { ...customerCatalogVisibilityFilter };

  if (query.parentCategoryId) {
    if (query.parentCategoryId === 'null') {
      filter.parentCategoryId = null;
    } else if (Types.ObjectId.isValid(query.parentCategoryId)) {
      filter.parentCategoryId = new Types.ObjectId(query.parentCategoryId);
    }
  }

  if (typeof query.isFeatured === 'boolean') {
    filter.isFeatured = query.isFeatured;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [{ name: searchRegex }, { slug: searchRegex }];
  }

  const { skip, limit } = paginate(query.page, query.limit);

  const [items, total] = await Promise.all([
    CategoryModel.find(filter)
      .sort({ displayOrder: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CategoryModel.countDocuments(filter),
  ]);

  return {
    items: items as (CategoryRecord & { _id: Types.ObjectId })[],
    total,
  };
};

export const listCustomerBrands = async (
  query: CustomerBrandBrowseQuery,
): Promise<PaginatedCatalogResult<BrandRecord & { _id: Types.ObjectId }>> => {
  const filter: FilterQuery<BrandRecord> = { ...customerCatalogVisibilityFilter };

  if (typeof query.isFeatured === 'boolean') {
    filter.isFeatured = query.isFeatured;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [{ name: searchRegex }, { slug: searchRegex }];
  }

  const { skip, limit } = paginate(query.page, query.limit);

  const [items, total] = await Promise.all([
    BrandModel.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BrandModel.countDocuments(filter),
  ]);

  return {
    items: items as (BrandRecord & { _id: Types.ObjectId })[],
    total,
  };
};

const loadStoreContextForProduct = async (
  productId: Types.ObjectId,
  scope: CustomerScope,
): Promise<CustomerCatalogStoreContext | null> => {
  const storeProductMatch = buildStoreProductBaseMatch(
    { page: 1, limit: 1 },
    scope,
  );
  storeProductMatch.productId = productId;

  const storeProduct = await StoreProductModel.findOne(storeProductMatch)
    .sort({ isFeatured: -1, updatedAt: -1 })
    .lean();

  if (!storeProduct) {
    return null;
  }

  const stock = await InventoryStockModel.findOne({
    storeProductId: storeProduct._id,
    isDeleted: false,
    status: 'active',
  }).lean();

  return {
    storeProductId: storeProduct._id.toString(),
    variantId: storeProduct.variantId.toString(),
    mrp: storeProduct.mrp,
    sellingPrice: storeProduct.sellingPrice,
    finalPrice: storeProduct.finalPrice,
    discountType: storeProduct.discountType,
    discountValue: storeProduct.discountValue,
    isAvailable: storeProduct.isAvailable,
    isOutOfStock: stock?.isOutOfStock ?? false,
    availableQuantity: stock?.availableQuantity ?? 0,
    isLowStock: stock?.isLowStock ?? false,
  };
};

export const getCatalogProductDetailForCustomer = async (
  productId: string,
  scope: CustomerScope,
): Promise<{
  product: ProductRecord & { _id: Types.ObjectId };
  storeContext: CustomerCatalogStoreContext | null;
} | null> => {
  if (!Types.ObjectId.isValid(productId)) {
    return null;
  }

  const product = await ProductModel.findOne({
    _id: new Types.ObjectId(productId),
    ...customerCatalogProductVisibilityFilter(),
  }).lean();

  if (!product) {
    return null;
  }

  const typedProduct = product as ProductRecord & { _id: Types.ObjectId };
  const hasScope = Boolean(scope.cityId || scope.storeId);
  const storeContext = hasScope
    ? await loadStoreContextForProduct(typedProduct._id, scope)
    : null;

  return { product: typedProduct, storeContext };
};

export const listCatalogProductVariantsForCustomer = async (
  productId: string,
): Promise<(ProductVariantRecord & { _id: Types.ObjectId })[]> => {
  if (!Types.ObjectId.isValid(productId)) {
    return [];
  }

  const productExists = await ProductModel.exists({
    _id: new Types.ObjectId(productId),
    ...customerCatalogProductVisibilityFilter(),
  });

  if (!productExists) {
    return [];
  }

  const variants = await ProductVariantModel.find({
    productId: new Types.ObjectId(productId),
    ...customerCatalogVariantVisibilityFilter(),
  })
    .sort({ isDefault: -1, variantName: 1 })
    .lean();

  return variants as (ProductVariantRecord & { _id: Types.ObjectId })[];
};
