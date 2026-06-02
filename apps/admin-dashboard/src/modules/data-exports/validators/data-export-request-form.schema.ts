import { z } from 'zod';

import {
  DATA_EXPORT_FORMATS,
  DATA_EXPORT_TYPES,
} from '../types/data-export.types';

export const dataExportRequestFormSchema = z.object({
  exportType: z.enum(DATA_EXPORT_TYPES),
  format: z.enum(DATA_EXPORT_FORMATS),
  filtersText: z.string().trim().default('{}'),
  reason: z.string().trim().min(5).max(500),
});

export type DataExportRequestFormValues = z.input<typeof dataExportRequestFormSchema>;

export const parseDataExportFilters = (filtersText: string): Record<string, unknown> => {
  const trimmed = filtersText.trim();
  if (!trimmed) return {};

  const parsed = JSON.parse(trimmed) as unknown;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Filters must be a JSON object.');
  }

  return parsed as Record<string, unknown>;
};
