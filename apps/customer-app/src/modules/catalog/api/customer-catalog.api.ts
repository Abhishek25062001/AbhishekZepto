import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type { CustomerBrand } from '../types/customer-brand.types';
import type { CustomerCategory } from '../types/customer-category.types';
import type {
  CustomerCatalogFacets,
  CustomerCatalogListQuery,
} from '../types/customer-catalog-query.types';
import type { CustomerProduct } from '../types/customer-product.types';
import type { CustomerProductVariant } from '../types/customer-product-variant.types';
import { unwrapData, unwrapPaginated } from '../utils/customer-catalog-api.util';

const BASE = '/api/v1/customer/catalog';

const withLocationContext = (
  query: CustomerCatalogListQuery = {},
  cityId?: string | null,
  storeId?: string | null,
): CustomerCatalogListQuery => ({
  ...query,
  ...(cityId ? { cityId } : {}),
  ...(storeId ? { storeId } : {}),
});

export const getCustomerCategories = async (
  cityId?: string | null,
  storeId?: string | null,
) => {
  const response = await apiClient.get<ApiSuccessResponse<CustomerCategory[]>>(`${BASE}/categories`, {
    params: { page: 1, limit: 50, ...(cityId ? { cityId } : {}), ...(storeId ? { storeId } : {}) },
  });
  return unwrapData(response.data);
};

export const getCustomerBrands = async (cityId?: string | null) => {
  const response = await apiClient.get<ApiSuccessResponse<CustomerBrand[]>>(`${BASE}/brands`, {
    params: { page: 1, limit: 50, ...(cityId ? { cityId } : {}) },
  });
  return unwrapData(response.data);
};

export const getCustomerProducts = async (
  query: CustomerCatalogListQuery = {},
  storeId?: string | null,
) => {
  const response = await apiClient.get<ApiSuccessResponse<CustomerProduct[]>>(`${BASE}/products`, {
    params: withLocationContext(query, query.cityId, storeId ?? query.storeId),
  });
  return unwrapPaginated(response.data);
};

export const getCustomerProductById = async (productId: string, cityId?: string | null) => {
  const response = await apiClient.get<ApiSuccessResponse<CustomerProduct>>(
    `${BASE}/products/${productId}`,
    { params: cityId ? { cityId } : undefined },
  );
  return unwrapData(response.data);
};

export const searchCustomerCatalog = async (
  query: CustomerCatalogListQuery & { q: string },
) => {
  const { q, ...rest } = query;
  delete rest.search;
  const response = await apiClient.get<ApiSuccessResponse<CustomerProduct[]>>(`${BASE}/search`, {
    params: withLocationContext({ ...rest, q }, rest.cityId, rest.storeId),
  });
  return unwrapPaginated(response.data);
};

export const getCustomerCatalogFacets = async (query: CustomerCatalogListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<CustomerCatalogFacets>>(`${BASE}/facets`, {
    params: withLocationContext(query, query.cityId, query.storeId),
  });
  return unwrapData(response.data);
};

export const getCustomerFeaturedProducts = async (query: CustomerCatalogListQuery = {}) => {
  const response = await apiClient.get<ApiSuccessResponse<CustomerProduct[]>>(
    `${BASE}/featured-products`,
    { params: withLocationContext({ ...query, isFeatured: true }, query.cityId, query.storeId) },
  );
  return unwrapPaginated(response.data);
};

export const getCustomerProductVariants = async (productId: string, cityId?: string | null) => {
  const response = await apiClient.get<ApiSuccessResponse<CustomerProductVariant[]>>(
    `${BASE}/products/${productId}/variants`,
    { params: cityId ? { cityId } : undefined },
  );
  return unwrapData(response.data);
};
