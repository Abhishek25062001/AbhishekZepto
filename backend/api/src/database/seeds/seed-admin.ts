export const seedSuperAdmin = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log('Dry run: super admin seed skipped');
    return;
  }

  // TODO: Create real super admin user after Admin Dashboard authentication starts.
  console.log('Super admin seed placeholder completed');
};
