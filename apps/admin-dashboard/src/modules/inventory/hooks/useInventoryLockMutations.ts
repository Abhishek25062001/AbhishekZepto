import { useMutation, useQueryClient } from '@tanstack/react-query';

import { expireDueInventoryLocks } from '../api/inventory-lock.api';

export function useInventoryLockMutations() {
  const queryClient = useQueryClient();

  const expireDueMutation = useMutation({
    mutationFn: () => expireDueInventoryLocks(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-inventory-locks'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-inventory-stock'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-inventory-movements'] });
    },
  });

  return { expireDueMutation };
}
