import { useQuery } from '@tanstack/react-query';

import { listDataExports } from '../api/data-export.api';
import type { DataExportListQuery } from '../types/data-export.types';

export const dataExportQueryKeys = {
  all: ['data-exports'] as const,
  list: (query: DataExportListQuery) => [...dataExportQueryKeys.all, 'list', query] as const,
  detail: (exportId: string) => [...dataExportQueryKeys.all, 'detail', exportId] as const,
};

export const useDataExports = (query: DataExportListQuery = {}) => useQuery({
  queryKey: dataExportQueryKeys.list(query),
  queryFn: () => listDataExports(query),
});
