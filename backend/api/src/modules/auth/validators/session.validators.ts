import { z } from 'zod';
import { mongoObjectIdValidator } from '../../../validators/common.validators';

export const adminUserIdParamValidator = {
  params: z.object({
    userId: mongoObjectIdValidator,
  }),
};

export const adminUserSessionParamsValidator = {
  params: z.object({
    userId: mongoObjectIdValidator,
    sessionId: mongoObjectIdValidator,
  }),
};
