import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createDataExport } from '../api/data-export.api';
import type { CreateDataExportRequest } from '../types/data-export.types';
import { dataExportQueryKeys } from './useDataExports';

export const useCreateDataExportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDataExportRequest) => createDataExport(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: dataExportQueryKeys.all });
    },
  });
};
