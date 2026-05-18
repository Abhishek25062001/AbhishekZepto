import { Types } from 'mongoose';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { writeAuditLog } from '../../../audit';
import { CATALOG_SEARCH_AUDIT_EVENTS } from '../constants/catalog-search-audit-events.constant';
import { CATALOG_SEARCH_ERROR_CODES } from '../constants/catalog-search-error-codes.constant';
import { PRODUCT_ERROR_CODES } from '../../products/constants/product-error-codes.constant';
import { toBrandResponse } from '../../brands/utils/brand-response.mapper';
import { toCategoryResponse } from '../../categories/utils/category-response.mapper';
import {
  getCatalogFacets,
  getCatalogProductDetailForCustomer,
  getCustomerFeaturedProducts,
  listCatalogProductVariantsForCustomer,
  listCustomerBrands,
  listCustomerCategories,
  searchAdminProducts,
  searchCustomerProducts,
  searchVendorProducts,
} from '../repositories/catalog-search.repository';
import {
  mapCustomerProductDetail,
  mapCustomerProductVariant,
} from '../utils/catalog-customer-product.mapper';
import type {
  AdminCatalogSearchQuery,
  CatalogFacetQuery,
  CustomerBrandBrowseQuery,
  CustomerCatalogListQuery,
  CustomerCatalogSearchQuery,
  CustomerCategoryBrowseQuery,
  CustomerProductDetailQuery,
  VendorCatalogSearchQuery,
} from '../types/catalog-search.types';

const productNotFoundError = () => ERROR_CODES[PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND];
import {
  mapAdminCatalogSearchItem,
  mapCatalogFacets,
  mapCustomerCatalogSearchItem,
  mapVendorCatalogSearchItem,
} from '../utils/catalog-search-response.mapper';

type Actor = {
  userId?: string;
  role?: string | null;
  vendorId?: string | null;
  storeId?: string | null;
  cityId?: string | null;
};

const catalogSearchError = (code: keyof typeof CATALOG_SEARCH_ERROR_CODES) =>
  ERROR_CODES[CATALOG_SEARCH_ERROR_CODES[code]];

const buildPagination = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
  hasNextPage: page * limit < total,
  hasPreviousPage: page > 1,
});

const resolveCustomerScope = (
  actor: Actor,
  query: { cityId?: string; storeId?: string },
) => {
  const cityId = query.cityId ?? actor.cityId ?? null;
  const storeId = query.storeId ?? null;

  if (storeId && !cityId) {
    throw new AppError({
      message: 'cityId is required when filtering by storeId',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: catalogSearchError('CATALOG_SEARCH_SCOPE_DENIED'),
    });
  }

  return { cityId, storeId };
};

const resolveVendorScope = (actor: Actor): { vendorId: string | null; storeId: string | null; cityId: string | null } => {
  if (!actor.vendorId) {
    throw new AppError({
      message: 'Vendor scope is required',
      statusCode: HTTP_STATUS.FORBIDDEN,
      errorCode: catalogSearchError('CATALOG_SEARCH_SCOPE_DENIED'),
    });
  }

  return {
    vendorId: actor.vendorId,
    storeId: actor.storeId ?? null,
    cityId: actor.cityId ?? null,
  };
};

const writeSearchAudit = async (
  eventType: string,
  actor: Actor,
  metadata: Record<string, unknown>,
) => {
  if (!actor.userId) {
    return;
  }

  const actorId = Types.ObjectId.isValid(actor.userId) ? new Types.ObjectId(actor.userId) : null;

  await writeAuditLog({
    eventType,
    actorId,
    actorRole: actor.role ?? null,
    actorSurface: 'backend',
    entityType: 'catalog_search',
    entityId: null,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata,
    status: 'success',
  });
};

export const searchAdminProductsService = async (query: AdminCatalogSearchQuery, actor: Actor) => {
  try {
    const result = await searchAdminProducts(query);

    if (query.search) {
      await writeSearchAudit(CATALOG_SEARCH_AUDIT_EVENTS.SEARCH_EXECUTED, actor, {
        surface: 'admin',
        search: query.search,
        resultCount: result.total,
      });
    }

    return {
      items: result.items.map(mapAdminCatalogSearchItem),
      pagination: buildPagination(query.page, query.limit, result.total),
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError({
      message: 'Catalog search failed',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: catalogSearchError('CATALOG_SEARCH_FAILED'),
    });
  }
};

export const searchVendorProductsService = async (query: VendorCatalogSearchQuery, actor: Actor) => {
  try {
    const result = await searchVendorProducts(query, resolveVendorScope(actor));

    if (query.search) {
      await writeSearchAudit(CATALOG_SEARCH_AUDIT_EVENTS.VENDOR_SEARCH_EXECUTED, actor, {
        surface: 'vendor',
        search: query.search,
        resultCount: result.total,
      });
    }

    return {
      items: result.items.map(mapVendorCatalogSearchItem),
      pagination: buildPagination(query.page, query.limit, result.total),
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError({
      message: 'Catalog search failed',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: catalogSearchError('CATALOG_SEARCH_FAILED'),
    });
  }
};

export const searchCustomerProductsService = async (
  query: CustomerCatalogListQuery,
  actor: Actor,
) => {
  try {
    const result = await searchCustomerProducts(query, resolveCustomerScope(actor, query));

    if (query.search) {
      await writeSearchAudit(CATALOG_SEARCH_AUDIT_EVENTS.CUSTOMER_SEARCH_EXECUTED, actor, {
        surface: 'customer',
        search: query.search,
        resultCount: result.total,
      });
    }

    return {
      items: result.items.map(mapCustomerCatalogSearchItem),
      pagination: buildPagination(query.page, query.limit, result.total),
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError({
      message: 'Catalog search failed',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: catalogSearchError('CATALOG_SEARCH_FAILED'),
    });
  }
};

export const searchCustomerCatalogService = async (
  query: CustomerCatalogSearchQuery,
  actor: Actor,
) => {
  const { q, ...rest } = query;
  return searchCustomerProductsService({ ...rest, search: q }, actor);
};

export const getCustomerFeaturedProductsService = async (
  query: CustomerCatalogListQuery,
  actor: Actor,
) => {
  try {
    const result = await getCustomerFeaturedProducts(query, resolveCustomerScope(actor, query));

    return {
      items: result.items.map(mapCustomerCatalogSearchItem),
      pagination: buildPagination(query.page, query.limit, result.total),
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError({
      message: 'Catalog search failed',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: catalogSearchError('CATALOG_SEARCH_FAILED'),
    });
  }
};

export const listCustomerCategoriesService = async (query: CustomerCategoryBrowseQuery) => {
  try {
    const result = await listCustomerCategories(query);

    return {
      items: result.items.map(toCategoryResponse),
      pagination: buildPagination(query.page, query.limit, result.total),
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError({
      message: 'Failed to fetch customer categories',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: catalogSearchError('CATALOG_SEARCH_FAILED'),
    });
  }
};

export const getCustomerProductDetailService = async (
  productId: string,
  actor: Actor,
  query: CustomerProductDetailQuery,
) => {
  const scope = resolveCustomerScope(actor, query);
  const result = await getCatalogProductDetailForCustomer(productId, scope);

  if (!result) {
    throw new AppError({
      message: 'Product not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: productNotFoundError(),
    });
  }

  return mapCustomerProductDetail(result.product, result.storeContext);
};

export const listCustomerProductVariantsService = async (productId: string) => {
  const variants = await listCatalogProductVariantsForCustomer(productId);

  if (variants.length === 0) {
    const product = await getCatalogProductDetailForCustomer(productId, {});

    if (!product) {
      throw new AppError({
        message: 'Product not found',
        statusCode: HTTP_STATUS.NOT_FOUND,
        errorCode: productNotFoundError(),
      });
    }
  }

  return variants.map(mapCustomerProductVariant);
};

export const listCustomerBrandsService = async (query: CustomerBrandBrowseQuery) => {
  try {
    const result = await listCustomerBrands(query);

    return {
      items: result.items.map(toBrandResponse),
      pagination: buildPagination(query.page, query.limit, result.total),
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError({
      message: 'Failed to fetch customer brands',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode: catalogSearchError('CATALOG_SEARCH_FAILED'),
    });
  }
};

export const getCustomerCatalogFacetsService = async (query: CatalogFacetQuery, actor: Actor) => {
  const facets = await getCatalogFacets(query, 'customer', resolveCustomerScope(actor, query));
  return mapCatalogFacets(facets);
};

export const getVendorCatalogFacetsService = async (query: CatalogFacetQuery, actor: Actor) => {
  const facets = await getCatalogFacets(query, 'vendor', resolveVendorScope(actor));
  return mapCatalogFacets(facets);
};

export const listVendorCategoriesService = listCustomerCategoriesService;
export const listVendorBrandsService = listCustomerBrandsService;

export const getVendorProductDetailService = async (
  productId: string,
  actor: Actor,
) => {
  return getCustomerProductDetailService(productId, actor, {
    cityId: actor.cityId ?? undefined,
    storeId: actor.storeId ?? undefined,
  });
};

export const listVendorProductVariantsService = listCustomerProductVariantsService;
