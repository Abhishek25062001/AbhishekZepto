import { useQuery } from '@tanstack/react-query';

import { isDevelopment } from '../config/env';
import { checkBackendHealth } from '../services/api/public.api';

export function useBackendHealth() {
  const query = useQuery({
    queryKey: ['backend-health'],
    queryFn: checkBackendHealth,
    enabled: isDevelopment,
  });

  return {
    healthData: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

