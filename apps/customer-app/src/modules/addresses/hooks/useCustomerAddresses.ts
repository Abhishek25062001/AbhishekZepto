import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCustomerAddress,
  deleteCustomerAddress,
  listCustomerAddresses,
  setDefaultCustomerAddress,
  updateCustomerAddress,
} from '../api/customer-address.api';
import type {
  CreateCustomerAddressInput,
  UpdateCustomerAddressInput,
} from '../types/customer-address.types';

const ADDRESSES_QUERY_KEY = ['customer-addresses'];

export function useCustomerAddresses() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: listCustomerAddresses,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });

  const createMutation = useMutation({
    mutationFn: (input: CreateCustomerAddressInput) => createCustomerAddress(input),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ addressId, input }: { addressId: string; input: UpdateCustomerAddressInput }) =>
      updateCustomerAddress(addressId, input),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (addressId: string) => deleteCustomerAddress(addressId),
    onSuccess: invalidate,
  });

  const setDefaultMutation = useMutation({
    mutationFn: (addressId: string) => setDefaultCustomerAddress(addressId),
    onSuccess: invalidate,
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
    setDefaultMutation,
  };
}
