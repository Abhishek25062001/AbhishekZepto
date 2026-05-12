import {
  SystemCheckModel,
  type SystemCheckRecord,
} from '../models/system-check.model';

export const upsertSystemCheck = async (): Promise<SystemCheckRecord> => {
  const systemCheck = await SystemCheckModel.findOneAndUpdate(
    {
      key: 'database_connection_test',
    },
    {
      $set: {
        value: 'ok',
        status: 'active',
        isDeleted: false,
        deletedAt: null,
      },
    },
    {
      new: true,
      setDefaultsOnInsert: true,
      upsert: true,
    },
  ).orFail();

  return systemCheck;
};
