import { Types } from 'mongoose';
import {
  getCustomerFeaturedProductsService,
  listCustomerCategoriesService,
} from '../../catalog/search/services/catalog-search.service';
import { findSelectedStoreByCustomerId } from '../../customer-addresses/repositories/customer-store-selection.repository';
import { findStoreById } from '../../stores/repositories/store.repository';
import { writeAuditLog } from '../../audit';
import { CUSTOMER_HOME_AUDIT_EVENTS } from '../constants/customer-home-audit-events.constant';
import type {
  CustomerHomeAuditContext,
  CustomerHomeFeedResponse,
  CustomerHomeQuery,
} from '../types/customer-home.types';
import { buildHomeServiceability, toHomeStoreSummary } from '../utils/customer-home.mapper';
import { storeNotFoundError, storeNotServiceableError } from '../utils/customer-home-error.mapper';

const DEFAULT_CATEGORY_LIMIT = 20;
const DEFAULT_FEATURED_LIMIT = 20;

type HomeActor = {
  userId?: string;
  cityId?: string | null;
};

const selectRootCategories = <
  T extends { parentCategoryId: string | null; level: number },
>(
  categories: T[],
): T[] => categories.filter((category) => category.parentCategoryId === null && category.level === 1);

export const getCustomerHomeFeed = async (
  customerId: string,
  query: CustomerHomeQuery,
  actor: HomeActor,
  audit?: CustomerHomeAuditContext,
): Promise<CustomerHomeFeedResponse> => {
  const store = await findStoreById(query.storeId);

  if (!store) {
    throw storeNotFoundError();
  }

  const selection = await findSelectedStoreByCustomerId(customerId);

  if (selection && selection.storeId.toString() !== query.storeId) {
    throw storeNotServiceableError();
  }

  const cityId = query.cityId ?? store.cityId.toString();
  const categoryLimit = query.categoryLimit ?? DEFAULT_CATEGORY_LIMIT;
  const featuredLimit = query.featuredLimit ?? DEFAULT_FEATURED_LIMIT;

  const catalogActor = {
    userId: actor.userId,
    cityId,
    storeId: query.storeId,
  };

  const [categoriesResult, featuredResult] = await Promise.all([
    listCustomerCategoriesService({
      page: 1,
      limit: categoryLimit,
      isFeatured: undefined,
    }),
    getCustomerFeaturedProductsService(
      {
        page: 1,
        limit: featuredLimit,
        cityId,
        storeId: query.storeId,
        isFeatured: true,
      },
      catalogActor,
    ),
  ]);

  const rootCategories = selectRootCategories(categoriesResult.items);

  if (audit?.actorId) {
    await writeAuditLog({
      eventType: CUSTOMER_HOME_AUDIT_EVENTS.VIEWED,
      actorId: new Types.ObjectId(audit.actorId),
      actorRole: 'customer',
      actorSurface: 'customer_app',
      entityType: 'store',
      entityId: store._id,
      vendorId: store.vendorId,
      storeId: store._id,
      cityId: store.cityId,
      requestId: audit.requestId ?? null,
      traceId: audit.traceId ?? null,
      ipAddress: null,
      userAgent: null,
      metadata: { storeId: query.storeId },
      status: 'success',
    });
  }

  return {
    store: toHomeStoreSummary(store),
    serviceability: buildHomeServiceability(store),
    categories: {
      items: rootCategories,
      pagination: {
        ...categoriesResult.pagination,
        total: rootCategories.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    featuredProducts: {
      items: featuredResult.items,
      pagination: featuredResult.pagination,
    },
    banners: [],
  };
};
