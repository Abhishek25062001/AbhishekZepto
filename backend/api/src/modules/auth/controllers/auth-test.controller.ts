import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';

export const authTestController = asyncHandler(async (req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Protected auth test route working',
    data: {
      user: req.user || {},
    },
  });
});
