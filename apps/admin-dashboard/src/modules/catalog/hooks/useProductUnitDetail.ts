import { useQuery } from '@tanstack/react-query';

import { getAdminProductUnitById } from '../api/product-unit.api';

export function useProductUnitDetail(unitId: string | undefined) {
  return useQuery({
    queryKey: ['admin-product-unit', unitId],
    queryFn: () => getAdminProductUnitById(unitId!),
    enabled: Boolean(unitId),
  });
}
