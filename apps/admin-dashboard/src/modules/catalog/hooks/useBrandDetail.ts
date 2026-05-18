import { useQuery } from '@tanstack/react-query';

import { getAdminBrandById } from '../api/brand.api';

export function useBrandDetail(brandId: string | undefined) {
  return useQuery({
    queryKey: ['admin-brand', brandId],
    queryFn: () => getAdminBrandById(brandId!),
    enabled: Boolean(brandId),
  });
}
