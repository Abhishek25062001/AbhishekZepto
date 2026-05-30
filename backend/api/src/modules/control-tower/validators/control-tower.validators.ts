import { z } from 'zod';
import { mongoObjectIdValidator } from '../../../validators/common.validators';

export const controlTowerQueryValidator = z.object({
  cityId: mongoObjectIdValidator.optional(),
});
