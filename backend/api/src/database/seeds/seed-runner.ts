import { seedSuperAdmin } from './seed-admin';
import { seedDefaultSettings } from './seed-default-settings';
import { seedRoles } from './seed-roles';
import { seedUnits } from './seed-units';

export type SeedRunnerOptions = {
  dryRun?: boolean;
};

export const runSeeds = async ({ dryRun = false }: SeedRunnerOptions = {}): Promise<void> => {
  await seedDefaultSettings(dryRun);
  await seedRoles(dryRun);
  await seedSuperAdmin(dryRun);
  await seedUnits(dryRun);
};
