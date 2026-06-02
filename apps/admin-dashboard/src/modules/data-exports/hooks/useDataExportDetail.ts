import { useQuery } from '@tanstack/react-query';

import { getDataExport } from '../api/data-export.api';
import { dataExportQueryKeys } from './useDataExports';

export const useDataExportDetail = (exportId: string) => useQuery({
  queryKey: dataExportQueryKeys.detail(exportId),
  queryFn: () => getDataExport(exportId),
  enabled: exportId.length > 0,
});
