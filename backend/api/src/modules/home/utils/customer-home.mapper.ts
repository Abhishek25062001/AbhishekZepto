import type { Types } from 'mongoose';
import type { CustomerCatalogSearchItem } from '../../catalog/search/types/catalog-search.types';
import { mapCustomerCatalogSearchItem } from '../../catalog/search/utils/catalog-search-response.mapper';
import type { StoreRecord } from '../../stores/models/store.model';
import type {
  HomeProductCard,
  HomeServiceabilityBlock,
  HomeStoreSummary,
} from '../types/customer-home.types';

export const toHomeStoreSummary = (
  store: StoreRecord & { _id: Types.ObjectId },
): HomeStoreSummary => ({
  id: store._id.toString(),
  name: store.name,
  cityId: store.cityId.toString(),
  code: store.code,
  isOpen: store.isOpen,
  isAcceptingOrders: store.isAcceptingOrders,
});

export const buildHomeServiceability = (
  store: StoreRecord & { _id: Types.ObjectId },
): HomeServiceabilityBlock => {
  const isOperational =
    store.status === 'active' && store.isOpen && store.isAcceptingOrders && !store.isDeleted;

  if (isOperational) {
    return { isServiceable: true, message: null };
  }

  let message = 'Store is currently unavailable';

  if (!store.isOpen) {
    message = 'Store is closed';
  } else if (!store.isAcceptingOrders) {
    message = 'Store is not accepting orders';
  } else if (store.status !== 'active') {
    message = 'Store is inactive';
  }

  return { isServiceable: false, message };
};

export const mapCatalogItemToHomeProduct = (item: CustomerCatalogSearchItem): HomeProductCard =>
  mapCustomerCatalogSearchItem(item);
