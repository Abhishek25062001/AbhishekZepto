import { seedAuthIdentities } from './seed-auth-users';
import { seedSuperAdmin } from './seed-admin';
import { seedDefaultSettings } from './seed-default-settings';
import { seedRoles } from './seed-roles';
import { seedTenantAccessTests } from './seed-tenant-access-tests';
import { seedLocations } from './seed-locations';
import { seedCustomerAddresses } from './seed-customer-addresses';
import { seedDemoCart } from './seed-demo-cart';
import { seedInventory } from './seed-inventory';
import { seedStoreProducts } from './seed-store-products';
import { seedStores } from './seed-stores';
import { seedCatalog } from './seed-catalog';
import { seedLedgerAccounts } from './seed-ledger-accounts';

export type SeedRunnerOptions = {
  dryRun?: boolean;
};

export const runSeeds = async ({ dryRun = false }: SeedRunnerOptions = {}): Promise<void> => {
  await seedDefaultSettings(dryRun);
  await seedRoles(dryRun);
  await seedLedgerAccounts(dryRun);
  await seedAuthIdentities(dryRun);
  await seedTenantAccessTests(dryRun);
  await seedSuperAdmin(dryRun);
  await seedCatalog(dryRun);
  await seedLocations(dryRun);
  await seedStores(dryRun);
  await seedStoreProducts(dryRun);
  await seedInventory(dryRun);
  await seedCustomerAddresses(dryRun);
  await seedDemoCart(dryRun);
};
