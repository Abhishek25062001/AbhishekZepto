import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createAdminStore, deleteAdminStore, updateAdminStore } from '../api/store.api';
import type { StoreFormValues } from '../types/store.types';

export function useStoreMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-stores'] });
    void queryClient.invalidateQueries({ queryKey: ['admin-store'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: StoreFormValues) => createAdminStore(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ storeId, payload }: { storeId: string; payload: Partial<StoreFormValues> }) =>
      updateAdminStore(storeId, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (storeId: string) => deleteAdminStore(storeId),
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
}
