import { Types } from 'mongoose';
import { findCityBySlug } from '../../modules/locations/cities/repositories/city.repository';
import { findServiceAreaByCityAndSlug } from '../../modules/locations/service-areas/repositories/service-area.repository';
import {
  findStoreByCode,
  createStore,
} from '../../modules/stores/repositories/store.repository';

const SEED_STORE_CODE = 'STORE-000001';
const SEED_VENDOR_ID = new Types.ObjectId('65f0a0000000000000000001');

export const seedStores = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log('Dry run: would upsert store', SEED_STORE_CODE);
    return;
  }

  const city = await findCityBySlug('delhi');

  if (!city) {
    console.log('Skipping store seed: Delhi city not found (run seed-locations first)');
    return;
  }

  const serviceArea = await findServiceAreaByCityAndSlug(city._id.toString(), 'dwarka');
  const existing = await findStoreByCode(SEED_STORE_CODE);

  if (existing) {
    console.log('Store already exists:', existing.code);
    return;
  }

  const store = await createStore({
    vendorId: SEED_VENDOR_ID,
    cityId: city._id,
    serviceAreaIds: serviceArea ? [serviceArea._id] : [],
    name: 'Zepto Dwarka',
    slug: 'zepto-dwarka',
    code: SEED_STORE_CODE,
    description: 'Seed dark store for Dwarka',
    phone: '9999999998',
    email: null,
    addressLine1: 'Sector 10, Dwarka',
    addressLine2: null,
    landmark: null,
    pincode: '110075',
    latitude: 28.5921,
    longitude: 77.046,
    serviceRadiusKm: 5,
    openingTime: '08:00',
    closingTime: '22:00',
    operatingDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    isOpen: true,
    isAcceptingOrders: true,
    temporaryClosureReason: null,
    storeType: 'dark_store',
    fulfillmentType: 'delivery',
    status: 'active',
  });

  console.log('Seeded store:', store.code);
};
