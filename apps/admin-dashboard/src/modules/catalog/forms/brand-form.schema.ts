import { z } from 'zod';

import { CATALOG_STATUS } from '../constants/catalog-status.constants';

const optionalTrimmedId = z
  .string()
  .optional()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  });

export const brandFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z
    .string()
    .max(5000)
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  logoMediaFileId: optionalTrimmedId,
  bannerMediaFileId: optionalTrimmedId,
  logoUrl: z
    .string()
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  bannerUrl: z
    .string()
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  isFeatured: z.boolean(),
  isVisible: z.boolean(),
  status: z.enum([CATALOG_STATUS.ACTIVE, CATALOG_STATUS.INACTIVE, CATALOG_STATUS.ARCHIVED]),
});

export type BrandFormInput = z.input<typeof brandFormSchema>;
export type BrandFormSchemaValues = z.output<typeof brandFormSchema>;
