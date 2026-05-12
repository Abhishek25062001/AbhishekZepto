export const seedUnits = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log('Dry run: units seed skipped');
    return;
  }

  console.log('Units seed placeholder completed');
};
