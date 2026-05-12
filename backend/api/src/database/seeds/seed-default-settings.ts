export const seedDefaultSettings = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log('Dry run: default settings seed skipped');
    return;
  }

  console.log('Default settings seed placeholder completed');
};
