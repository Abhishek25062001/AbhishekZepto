import { z } from 'zod';

import { mongoObjectIdValidator } from '../../../validators/common.validators';
import {
  ADMIN_CONTROL_ACTIVE_MODULES,
  ADMIN_CONTROL_SESSION_TYPES,
} from '../constants/admin-control-session.constants';

export const createAdminControlSessionBodyValidator = z.object({
  sessionType: z.enum(
    ADMIN_CONTROL_SESSION_TYPES as [string, ...string[]],
  ),
  cityScope: z.array(mongoObjectIdValidator).min(1),
  activeModules: z
    .array(z.enum(ADMIN_CONTROL_ACTIVE_MODULES as [string, ...string[]]))
    .min(1),
});

export const adminControlSessionBodyValidator = z.object({
  sessionId: mongoObjectIdValidator,
});
