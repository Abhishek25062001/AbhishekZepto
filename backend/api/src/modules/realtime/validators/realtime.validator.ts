import { z } from 'zod';

export const ackEventParamsValidator = z.object({
  eventId: z.string().trim().min(1),
});
