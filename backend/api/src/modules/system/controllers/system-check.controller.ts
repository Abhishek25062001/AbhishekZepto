import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import { runDatabaseWriteCheck } from '../services/system-check.service';

export const databaseWriteCheckController = asyncHandler(async (_req, res) => {
  const systemCheck = await runDatabaseWriteCheck();

  return sendSuccessResponse({
    res,
    message: 'Database write check completed',
    data: {
      key: systemCheck.key,
      value: systemCheck.value,
    },
  });
});
