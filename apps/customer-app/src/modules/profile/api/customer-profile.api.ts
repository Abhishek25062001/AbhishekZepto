import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type { CustomerProfile, UpdateCustomerProfileInput } from '../types/profile.types';

const BASE = '/api/v1/customer/profile';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

export const getCustomerProfile = async (): Promise<CustomerProfile> => {
  const response = await apiClient.get<ApiSuccessResponse<CustomerProfile>>(BASE);
  return unwrapData(response.data);
};

export const updateCustomerProfile = async (
  input: UpdateCustomerProfileInput,
): Promise<CustomerProfile> => {
  const response = await apiClient.patch<ApiSuccessResponse<CustomerProfile>>(BASE, input);
  return unwrapData(response.data);
};
