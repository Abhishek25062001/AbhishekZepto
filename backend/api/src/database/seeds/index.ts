import { runSeeds } from './seed-runner';

const isDryRun = process.argv.includes('--dry-run');

const run = async (): Promise<void> => {
  if (isDryRun) {
    await runSeeds({ dryRun: true });
    console.log('Seed dry-run completed without database writes');
    return;
  }

  const { connectMongoDB, disconnectMongoDB } = await import('../../config/database');

  await connectMongoDB();

  try {
    await runSeeds();
    console.log('Seed run completed');
  } finally {
    await disconnectMongoDB();
  }
};

void run().catch((error) => {
  console.error('Seed run failed:', error);
  process.exitCode = 1;
});
