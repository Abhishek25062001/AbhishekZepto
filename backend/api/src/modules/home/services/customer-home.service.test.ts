import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import type { StoreRecord } from '../../stores/models/store.model';
import * as auditLogServiceModule from '../../audit/services/audit-log.service';
import * as catalogSearchServiceModule from '../../catalog/search/services/catalog-search.service';
import * as selectionRepositoryModule from '../../customer-addresses/repositories/customer-store-selection.repository';
import * as storeRepositoryModule from '../../stores/repositories/store.repository';
import { getCustomerHomeFeed } from './customer-home.service';

const storeRepository = storeRepositoryModule as unknown as {
  findStoreById: (storeId: string) => Promise<(StoreRecord & { _id: Types.ObjectId }) | null>;
};

const selectionRepository = selectionRepositoryModule as unknown as {
  findSelectedStoreByCustomerId: (
    customerId: string,
  ) => Promise<{ storeId: Types.ObjectId } | null>;
};

const catalogSearchService = catalogSearchServiceModule as unknown as {
  listCustomerCategoriesService: typeof catalogSearchServiceModule.listCustomerCategoriesService;
  getCustomerFeaturedProductsService: typeof catalogSearchServiceModule.getCustomerFeaturedProductsService;
};

const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const customerId = new Types.ObjectId().toString();
const storeId = new Types.ObjectId();
const cityId = new Types.ObjectId();

const buildStore = (
  overrides: Partial<StoreRecord> = {},
): StoreRecord & { _id: Types.ObjectId } => ({
  _id: storeId,
  vendorId: new Types.ObjectId(),
  cityId,
  serviceAreaIds: [],
  name: 'Zepto Dwarka',
  slug: 'zepto-dwarka',
  code: 'STORE-000001',
  description: null,
  phone: '9999999998',
  email: null,
  addressLine1: 'Sector 10',
  addressLine2: null,
  landmark: null,
  pincode: '110075',
  latitude: 28.5921,
  longitude: 77.046,
  serviceRadiusKm: 5,
  openingTime: '08:00',
  closingTime: '22:00',
  operatingDays: [],
  isOpen: true,
  isAcceptingOrders: true,
  temporaryClosureReason: null,
  storeType: 'dark_store',
  fulfillmentType: 'delivery',
  status: 'active',
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

beforeEach(() => {
  auditLogService.writeAuditLog = async () => undefined;
});

afterEach(() => {
  storeRepository.findStoreById = storeRepositoryModule.findStoreById;
  selectionRepository.findSelectedStoreByCustomerId =
    selectionRepositoryModule.findSelectedStoreByCustomerId;
  catalogSearchService.listCustomerCategoriesService =
    catalogSearchServiceModule.listCustomerCategoriesService;
  catalogSearchService.getCustomerFeaturedProductsService =
    catalogSearchServiceModule.getCustomerFeaturedProductsService;
});

test('getCustomerHomeFeed returns aggregated sections', async () => {
  storeRepository.findStoreById = async () => buildStore();
  selectionRepository.findSelectedStoreByCustomerId = async () => ({
    storeId,
  });
  catalogSearchService.listCustomerCategoriesService = async () => ({
    items: [
      {
        id: 'cat1',
        name: 'Groceries',
        slug: 'groceries',
        description: null,
        parentCategoryId: null,
        level: 1,
        displayOrder: 0,
        iconUrl: null,
        bannerUrl: null,
        isFeatured: false,
        isVisible: true,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });
  catalogSearchService.getCustomerFeaturedProductsService = async () => ({
    items: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const feed = await getCustomerHomeFeed(
    customerId,
    { storeId: storeId.toString() },
    { userId: customerId },
    { actorId: customerId },
  );

  assert.equal(feed.store.name, 'Zepto Dwarka');
  assert.equal(feed.serviceability.isServiceable, true);
  assert.equal(feed.categories.items.length, 1);
  assert.deepEqual(feed.banners, []);
});

test('getCustomerHomeFeed throws when store not found', async () => {
  storeRepository.findStoreById = async () => null;

  await assert.rejects(
    () => getCustomerHomeFeed(customerId, { storeId: storeId.toString() }, { userId: customerId }),
    (error: unknown) =>
      error instanceof AppError && error.errorCode === ERROR_CODES.STORE_NOT_FOUND,
  );
});

test('getCustomerHomeFeed rejects store mismatch with selection', async () => {
  storeRepository.findStoreById = async () => buildStore();
  selectionRepository.findSelectedStoreByCustomerId = async () => ({
    storeId: new Types.ObjectId(),
  });

  await assert.rejects(
    () => getCustomerHomeFeed(customerId, { storeId: storeId.toString() }, { userId: customerId }),
    (error: unknown) =>
      error instanceof AppError && error.errorCode === ERROR_CODES.STORE_NOT_SERVICEABLE,
  );
});

test('getCustomerHomeFeed marks closed store as not serviceable', async () => {
  storeRepository.findStoreById = async () => buildStore({ isOpen: false });
  selectionRepository.findSelectedStoreByCustomerId = async () => null;
  catalogSearchService.listCustomerCategoriesService = async () => ({
    items: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });
  catalogSearchService.getCustomerFeaturedProductsService = async () => ({
    items: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });

  const feed = await getCustomerHomeFeed(customerId, { storeId: storeId.toString() }, {
    userId: customerId,
  });

  assert.equal(feed.serviceability.isServiceable, false);
  assert.equal(feed.serviceability.message, 'Store is closed');
});
