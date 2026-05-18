import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import { findUserIdentityByPhoneAndRole } from '../../modules/auth/repositories/user-identity.repository';
import { upsertTenantAccessTestRecordByLabel } from '../../modules/system/repositories/tenant-access-test.repository';

const seededVendorId = '65f0a0000000000000000001';
const seededStoreId = '65f0a0000000000000000002';
const seededCityId = '65f0a0000000000000000003';

export const seedTenantAccessTests = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log(
      'Dry run: tenant access test seed skipped for seeded internal scope records',
    );
    return;
  }

  const customerUser = await findUserIdentityByPhoneAndRole('9999999999', AUTH_ROLE.CUSTOMER);
  const deliveryAgentUser = await findUserIdentityByPhoneAndRole(
    '8888888888',
    AUTH_ROLE.DELIVERY_AGENT,
  );

  if (!customerUser || !deliveryAgentUser) {
    console.log(
      'Tenant access test seed skipped because seeded customer/delivery identities were not found',
    );
    return;
  }

  await upsertTenantAccessTestRecordByLabel({
    label: 'seeded-vendor-store-customer-record',
    vendorId: seededVendorId,
    storeId: seededStoreId,
    cityId: seededCityId,
    customerId: customerUser._id.toString(),
    deliveryAgentId: null,
  });

  await upsertTenantAccessTestRecordByLabel({
    label: 'seeded-vendor-store-delivery-record',
    vendorId: seededVendorId,
    storeId: seededStoreId,
    cityId: seededCityId,
    customerId: null,
    deliveryAgentId: deliveryAgentUser._id.toString(),
  });

  await upsertTenantAccessTestRecordByLabel({
    label: 'seeded-combined-tenant-record',
    vendorId: seededVendorId,
    storeId: seededStoreId,
    cityId: seededCityId,
    customerId: customerUser._id.toString(),
    deliveryAgentId: deliveryAgentUser._id.toString(),
  });

  console.log('Tenant access test records seeded');
};
