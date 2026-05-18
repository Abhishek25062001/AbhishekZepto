import { z } from 'zod';
import { LOCATION_STATUS } from '../constants/store.constants';

export const cityFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().max(200).optional().transform((v) => (v === '' ? undefined : v)),
  state: z.string().min(1, 'State is required').max(100),
  country: z.string().max(100).optional().default('India'),
  timezone: z.string().min(1, 'Timezone is required'),
  currencyCode: z.string().min(1, 'Currency code is required').max(10),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  serviceRadiusKm: z.coerce.number().positive('Service radius must be positive').optional(),
  isServiceable: z.boolean().optional().default(true),
  status: z.enum([LOCATION_STATUS.ACTIVE, LOCATION_STATUS.INACTIVE, LOCATION_STATUS.ARCHIVED]),
});

export type CityFormInput = z.input<typeof cityFormSchema>;
export type CityFormSchemaValues = z.output<typeof cityFormSchema>;
