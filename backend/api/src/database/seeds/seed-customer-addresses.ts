import { Types } from 'mongoose';
import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import { findUserIdentityByPhoneAndRole } from '../../modules/auth/repositories/user-identity.repository';
import {
  createAddress,
  findAddressesByCustomerId,
  updateAddressById,
} from '../../modules/customer-addresses/repositories/customer-address.repository';
import { upsertSelectedStore } from '../../modules/customer-addresses/repositories/customer-store-selection.repository';
import { findStoreByCode } from '../../modules/stores/repositories/store.repository';

const SEED_CUSTOMER_PHONE = '9999999999';
const SEED_ADDRESS_LABEL = 'Seed Home';
const SEED_STORE_CODE = 'STORE-000001';

export const seedCustomerAddresses = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log('Dry run: would upsert customer address for', SEED_CUSTOMER_PHONE);
    return;
  }

  const customer = await findUserIdentityByPhoneAndRole(SEED_CUSTOMER_PHONE, AUTH_ROLE.CUSTOMER);

  if (!customer) {
    console.log('Skipping customer address seed: dev customer not found');
    return;
  }

  const store = await findStoreByCode(SEED_STORE_CODE);

  if (!store) {
    console.log('Skipping customer address seed: seed store not found');
    return;
  }

  const customerId = customer._id.toString();
  const existingAddresses = await findAddressesByCustomerId(customerId);
  const existing = existingAddresses.find((address) => address.label === SEED_ADDRESS_LABEL);

  const addressPayload = {
    customerId: customer._id,
    label: SEED_ADDRESS_LABEL,
    line1: store.addressLine1,
    line2: store.addressLine2,
    landmark: store.landmark,
    city: 'Delhi',
    cityId: store.cityId,
    state: 'Delhi',
    postalCode: store.pincode,
    country: 'IN',
    latitude: store.latitude,
    longitude: store.longitude,
    isDefault: true,
    status: 'active' as const,
    isDeleted: false,
    deletedAt: null,
  };

  let addressId: Types.ObjectId;

  if (existing) {
    const updated = await updateAddressById(existing._id.toString(), customerId, addressPayload);

    if (!updated) {
      console.log('Failed to update seed customer address');
      return;
    }

    addressId = updated._id;
    console.log('Updated seed customer address:', SEED_ADDRESS_LABEL);
  } else {
    const created = await createAddress(addressPayload);
    addressId = created._id;
    console.log('Seeded customer address:', SEED_ADDRESS_LABEL);
  }

  await upsertSelectedStore({
    customerId,
    addressId: addressId.toString(),
    storeId: store._id.toString(),
  });

  console.log('Seeded customer store selection for', SEED_STORE_CODE);
};
