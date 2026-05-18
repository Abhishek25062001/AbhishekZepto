import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createAdminCity, deleteAdminCity, updateAdminCity } from '../api/city.api';
import type { CityFormValues } from '../types/city.types';

export function useCityMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
    void queryClient.invalidateQueries({ queryKey: ['admin-city'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CityFormValues) => createAdminCity(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ cityId, payload }: { cityId: string; payload: Partial<CityFormValues> }) =>
      updateAdminCity(cityId, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (cityId: string) => deleteAdminCity(cityId),
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
}
