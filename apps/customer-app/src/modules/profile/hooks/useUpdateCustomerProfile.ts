import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateCustomerProfile } from '../api/customer-profile.api';
import type { UpdateCustomerProfileInput } from '../types/profile.types';
import { profileQueryKeys } from '../utils/profile-query-keys.util';

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCustomerProfileInput) => updateCustomerProfile(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileQueryKeys.detail() });
    },
  });
}
