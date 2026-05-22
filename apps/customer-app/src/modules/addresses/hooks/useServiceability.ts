import { useMutation } from '@tanstack/react-query';

import { checkServiceability } from '../api/customer-address.api';
import type { ServiceabilityInput } from '../types/serviceability.types';

export function useServiceability() {
  return useMutation({
    mutationFn: (input: ServiceabilityInput) => checkServiceability(input),
  });
}
