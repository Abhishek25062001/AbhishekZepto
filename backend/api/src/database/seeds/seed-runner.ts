import { seedAuthIdentities } from './seed-auth-users';
import { seedSuperAdmin } from './seed-admin';
import { seedDefaultSettings } from './seed-default-settings';
import { seedRoles } from './seed-roles';
import { seedTenantAccessTests } from './seed-tenant-access-tests';
import { seedLocations } from './seed-locations';
import { seedInventory } from './seed-inventory';
import { seedStoreProducts } from './seed-store-products';
import { seedStores } from './seed-stores';
import { seedCatalog } from './seed-catalog';

export type SeedRunnerOptions = {
  dryRun?: boolean;
};

export const runSeeds = async ({ dryRun = false }: SeedRunnerOptions = {}): Promise<void> => {
  await seedDefaultSettings(dryRun);
  await seedRoles(dryRun);
  await seedAuthIdentities(dryRun);
  await seedTenantAccessTests(dryRun);
  await seedSuperAdmin(dryRun);
  await seedCatalog(dryRun);
  await seedLocations(dryRun);
  await seedStores(dryRun);
  await seedStoreProducts(dryRun);
  await seedInventory(dryRun);
};
