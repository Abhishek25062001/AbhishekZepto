import { upsertSystemCheck } from '../repositories/system-check.repository';

export const runDatabaseWriteCheck = async () => {
  return upsertSystemCheck();
};
