import { useQuery } from '@tanstack/react-query';

import { getCustomerProfile } from '../api/customer-profile.api';
import { getProfileErrorMessage } from '../utils/customer-profile-error-message.util';
import { profileQueryKeys } from '../utils/profile-query-keys.util';

export function useCustomerProfile() {
  const query = useQuery({
    queryKey: profileQueryKeys.detail(),
    queryFn: getCustomerProfile,
  });

  const errorMessage = query.isError
    ? getProfileErrorMessage(query.error, 'Could not load your profile.')
    : null;

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage,
    refetch: query.refetch,
  };
}
