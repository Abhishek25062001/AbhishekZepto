import { useQuery } from '@tanstack/react-query';

import { isDevelopment } from '../config/env';
import { checkBackendHealth } from '../services/api/public.api';

export function useBackendHealth() {
  const query = useQuery({
    enabled: isDevelopment,
    queryFn: checkBackendHealth,
    queryKey: ['public', 'backend-health'],
    staleTime: 30_000,
  });

  return {
    error: query.error,
    healthData: query.data?.data,
    isLoading: query.isLoading,
  };
}
