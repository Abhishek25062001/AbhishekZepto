import type { CustomerCatalogListQuery } from '../types/customer-catalog-query.types';

export const buildCatalogQuery = (
  filters: Partial<CustomerCatalogListQuery>,
): CustomerCatalogListQuery => {
  const query: CustomerCatalogListQuery = {};

  if (filters.page !== undefined) {
    query.page = filters.page;
  }
  if (filters.limit !== undefined) {
    query.limit = filters.limit;
  }
  if (filters.search?.trim()) {
    query.search = filters.search.trim();
  }
  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }
  if (filters.subcategoryId) {
    query.subcategoryId = filters.subcategoryId;
  }
  if (filters.brandId) {
    query.brandId = filters.brandId;
  }
  if (filters.foodType) {
    query.foodType = filters.foodType;
  }
  if (filters.availability === 'available') {
    query.isAvailable = true;
  }
  if (filters.isFeatured !== undefined) {
    query.isFeatured = filters.isFeatured;
  }
  if (filters.minPrice !== undefined) {
    query.minPrice = filters.minPrice;
  }
  if (filters.maxPrice !== undefined) {
    query.maxPrice = filters.maxPrice;
  }
  if (filters.sortBy) {
    query.sortBy = filters.sortBy;
  }
  if (filters.sortOrder) {
    query.sortOrder = filters.sortOrder;
  }
  if (filters.cityId) {
    query.cityId = filters.cityId;
  }
  if (filters.storeId) {
    query.storeId = filters.storeId;
  }

  return query;
};
