import { useQuery } from '@tanstack/react-query';

import { getAdminServiceAreaById } from '../api/service-area.api';

export function useServiceAreaDetail(serviceAreaId: string | undefined) {
  return useQuery({
    queryKey: ['admin-service-area', serviceAreaId],
    queryFn: () => getAdminServiceAreaById(serviceAreaId as string),
    enabled: Boolean(serviceAreaId),
  });
}
