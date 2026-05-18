import assert from 'node:assert/strict';
import { test } from 'node:test';

import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import * as repositoryModule from '../repositories/catalog-search.repository';
import {
  getCustomerCatalogFacetsService,
  getCustomerProductDetailService,
  listCustomerBrandsService,
  listCustomerCategoriesService,
  listCustomerProductVariantsService,
  searchAdminProductsService,
  searchCustomerCatalogService,
  searchVendorProductsService,
} from './catalog-search.service';
import { PRODUCT_ERROR_CODES } from '../../products/constants/product-error-codes.constant';

const mutableRepository = repositoryModule as unknown as {
  searchAdminProducts: (...args: unknown[]) => Promise<{ items: unknown[]; total: number }>;
  searchVendorProducts: (...args: unknown[]) => Promise<{ items: unknown[]; total: number }>;
  searchCustomerProducts: (...args: unknown[]) => Promise<{ items: unknown[]; total: number }>;
  listCustomerCategories: (...args: unknown[]) => Promise<{ items: unknown[]; total: number }>;
  listCustomerBrands: (...args: unknown[]) => Promise<{ items: unknown[]; total: number }>;
  getCatalogProductDetailForCustomer: (...args: unknown[]) => Promise<unknown>;
  listCatalogProductVariantsForCustomer: (...args: unknown[]) => Promise<unknown[]>;
  getCatalogFacets: (...args: unknown[]) => Promise<unknown>;
};

test('searchAdminProductsService returns paginated mapped items', async () => {
  mutableRepository.searchAdminProducts = async () => ({
    items: [
      {
        id: '507f1f77bcf86cd799439011',
        name: 'Milk',
        slug: 'milk',
        categoryId: '507f1f77bcf86cd799439012',
        subcategoryId: null,
        brandId: null,
        categoryName: 'Dairy',
        brandName: null,
        productType: 'simple',
        foodType: 'veg',
        approvalStatus: 'approved',
        status: 'active',
        isVisible: true,
        isFeatured: false,
        defaultImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    total: 1,
  });

  const response = await searchAdminProductsService(
    { page: 1, limit: 20, search: 'milk' },
    { userId: '507f1f77bcf86cd799439013', role: 'super_admin' },
  );

  assert.equal(response.items.length, 1);
  assert.equal(response.pagination.total, 1);
});

test('searchVendorProductsService requires vendor scope', async () => {
  await assert.rejects(
    () =>
      searchVendorProductsService(
        { page: 1, limit: 20 },
        { userId: '507f1f77bcf86cd799439013', role: 'vendor_owner' },
      ),
    (error: unknown) =>
      error instanceof AppError && error.errorCode === ERROR_CODES.CATALOG_SEARCH_SCOPE_DENIED,
  );
});

test('searchCustomerCatalogService maps q to search', async () => {
  let capturedSearch: string | undefined;

  mutableRepository.searchCustomerProducts = async (...args: unknown[]) => {
    const query = args[0] as { search?: string };
    capturedSearch = query.search;
    return { items: [], total: 0 };
  };

  await searchCustomerCatalogService(
    { page: 1, limit: 20, q: 'milk' },
    { userId: '507f1f77bcf86cd799439013', role: 'customer', cityId: '507f1f77bcf86cd799439014' },
  );

  assert.equal(capturedSearch, 'milk');
});

test('listCustomerCategoriesService returns paginated categories', async () => {
  mutableRepository.listCustomerCategories = async () => ({
    items: [
      {
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        name: 'Dairy',
        slug: 'dairy-bread-eggs',
        description: null,
        parentCategoryId: null,
        level: 1,
        displayOrder: 1,
        iconUrl: null,
        bannerUrl: null,
        isFeatured: true,
        isVisible: true,
        status: 'active',
        isDeleted: false,
        deletedAt: null,
        createdBy: null,
        updatedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    total: 10,
  });

  const response = await listCustomerCategoriesService({ page: 1, limit: 50 });

  assert.equal(response.items.length, 1);
  assert.equal(response.items[0]?.slug, 'dairy-bread-eggs');
  assert.equal(response.pagination.total, 10);
});

test('listCustomerBrandsService returns paginated brands', async () => {
  mutableRepository.listCustomerBrands = async () => ({
    items: [
      {
        _id: { toString: () => '507f1f77bcf86cd799439012' },
        name: 'Amul',
        slug: 'amul',
        description: null,
        logoUrl: null,
        bannerUrl: null,
        isFeatured: true,
        isVisible: true,
        status: 'active',
        isDeleted: false,
        deletedAt: null,
        createdBy: null,
        updatedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    total: 8,
  });

  const response = await listCustomerBrandsService({ page: 1, limit: 50 });

  assert.equal(response.items.length, 1);
  assert.equal(response.items[0]?.name, 'Amul');
  assert.equal(response.pagination.total, 8);
});

test('getCustomerProductDetailService returns product detail', async () => {
  mutableRepository.getCatalogProductDetailForCustomer = async () => ({
    product: {
      _id: { toString: () => '507f1f77bcf86cd799439011' },
      name: 'Milk',
      slug: 'amul-taaza-milk-1l',
      description: 'Milk',
      shortDescription: 'Milk',
      categoryId: { toString: () => '507f1f77bcf86cd799439012' },
      subcategoryId: null,
      brandId: { toString: () => '507f1f77bcf86cd799439013' },
      productType: 'variant',
      foodType: 'veg',
      taxCategoryId: null,
      hsnCode: null,
      searchKeywords: [],
      tags: [],
      defaultImageUrl: null,
      imageUrls: [],
      attributeSummary: null,
      isFeatured: true,
      isVisible: true,
      approvalStatus: 'approved',
      status: 'active',
      isDeleted: false,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      approvedBy: null,
      approvedAt: null,
      rejectedBy: null,
      rejectedAt: null,
      rejectionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    storeContext: null,
  });

  const detail = await getCustomerProductDetailService(
    '507f1f77bcf86cd799439011',
    { userId: '507f1f77bcf86cd799439014', role: 'customer' },
    {},
  );

  assert.equal(detail.slug, 'amul-taaza-milk-1l');
  assert.equal(detail.storeProductId, null);
});

test('getCustomerProductDetailService throws when product missing', async () => {
  mutableRepository.getCatalogProductDetailForCustomer = async () => null;

  await assert.rejects(
    () =>
      getCustomerProductDetailService(
        '507f1f77bcf86cd799439011',
        { userId: '507f1f77bcf86cd799439014', role: 'customer' },
        {},
      ),
    (error: unknown) =>
      error instanceof AppError &&
      error.errorCode === ERROR_CODES[PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND],
  );
});

test('listCustomerProductVariantsService returns variants', async () => {
  mutableRepository.listCatalogProductVariantsForCustomer = async () => [
    {
      _id: { toString: () => '507f1f77bcf86cd799439020' },
      productId: { toString: () => '507f1f77bcf86cd799439011' },
      variantName: '1 Litre',
      sku: 'SEED-AMUL-TAAZA-1L',
      barcode: null,
      unit: 'litre',
      unitValue: 1,
      mrp: 6200,
      defaultSellingPrice: 5800,
      weightInGrams: null,
      lengthCm: null,
      widthCm: null,
      heightCm: null,
      imageUrl: null,
      attributeValues: null,
      isDefault: true,
      isVisible: true,
      status: 'active',
      isDeleted: false,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const variants = await listCustomerProductVariantsService('507f1f77bcf86cd799439011');

  assert.equal(variants.length, 1);
  assert.equal(variants[0]?.sku, 'SEED-AMUL-TAAZA-1L');
});

test('getCustomerCatalogFacetsService returns facet payload', async () => {
  mutableRepository.getCatalogFacets = async () => ({
    categories: [{ id: 'cat', name: 'Dairy', count: 2 }],
    brands: [],
    foodTypes: [],
    availability: [],
  });

  const facets = await getCustomerCatalogFacetsService(
    { cityId: '507f1f77bcf86cd799439014' },
    { userId: '507f1f77bcf86cd799439013', role: 'customer', cityId: '507f1f77bcf86cd799439014' },
  );

  assert.equal(facets.categories[0]?.count, 2);
});
