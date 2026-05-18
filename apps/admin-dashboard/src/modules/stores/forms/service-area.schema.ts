import { z } from 'zod';

import { LOCATION_STATUS } from '../constants/store.constants';
import type { ServiceAreaPolygonPoint } from '../types/service-area.types';

export const serviceAreaFormSchema = z
  .object({
    cityId: z.string().min(1, 'City is required'),
    name: z.string().min(1, 'Name is required').max(200),
    slug: z
      .string()
      .max(200)
      .optional()
      .transform((value) => (value === '' ? undefined : value)),
    description: z.string().max(5000).optional().nullable(),
    polygonJson: z.string().optional(),
    centerLatitude: z.coerce.number().optional(),
    centerLongitude: z.coerce.number().optional(),
    radiusKm: z.coerce.number().positive().optional(),
    isServiceable: z.boolean().optional().default(true),
    status: z.enum([LOCATION_STATUS.ACTIVE, LOCATION_STATUS.INACTIVE, LOCATION_STATUS.ARCHIVED]),
  })
  .superRefine((data, ctx) => {
    if (!data.polygonJson?.trim()) {
      return;
    }
    try {
      const parsed = JSON.parse(data.polygonJson) as unknown;
      if (!Array.isArray(parsed)) {
        ctx.addIssue({ code: 'custom', message: 'Polygon must be a JSON array', path: ['polygonJson'] });
      }
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid polygon JSON', path: ['polygonJson'] });
    }
  });

export type ServiceAreaFormInput = z.input<typeof serviceAreaFormSchema>;

export type ServiceAreaFormSchemaValues = Omit<z.output<typeof serviceAreaFormSchema>, 'polygonJson'> & {
  polygon?: ServiceAreaPolygonPoint[] | null;
};

export const toServiceAreaPayload = (
  values: z.output<typeof serviceAreaFormSchema>,
): ServiceAreaFormSchemaValues => {
  const { polygonJson, ...rest } = values;
  let polygon: ServiceAreaPolygonPoint[] | undefined;
  if (polygonJson?.trim()) {
    polygon = JSON.parse(polygonJson) as ServiceAreaPolygonPoint[];
  }
  return { ...rest, polygon: polygon ?? null };
};
