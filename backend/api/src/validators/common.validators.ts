import { z } from 'zod';

export const mongoObjectIdValidator = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid Mongo ObjectId');

export const paginationValidator = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const searchQueryValidator = z.object({
  search: z.string().trim().optional(),
});

export const statusValidator = z.enum(['active', 'inactive', 'blocked', 'pending', 'archived']);

export const emptyObjectValidator = z.object({}).strict();
