import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createAdminServiceArea,
  deleteAdminServiceArea,
  updateAdminServiceArea,
} from '../api/service-area.api';
import type { ServiceAreaFormValues } from '../types/service-area.types';

export function useServiceAreaMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-service-areas'] });
    void queryClient.invalidateQueries({ queryKey: ['admin-service-area'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: ServiceAreaFormValues) => createAdminServiceArea(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      serviceAreaId,
      payload,
    }: {
      serviceAreaId: string;
      payload: Partial<ServiceAreaFormValues>;
    }) => updateAdminServiceArea(serviceAreaId, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (serviceAreaId: string) => deleteAdminServiceArea(serviceAreaId),
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
}
