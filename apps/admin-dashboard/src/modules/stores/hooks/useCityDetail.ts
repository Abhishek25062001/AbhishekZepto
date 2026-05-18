import { useQuery } from '@tanstack/react-query';

import { getAdminCityById } from '../api/city.api';

export function useCityDetail(cityId: string | undefined) {
  return useQuery({
    queryKey: ['admin-city', cityId],
    queryFn: () => getAdminCityById(cityId as string),
    enabled: Boolean(cityId),
  });
}
