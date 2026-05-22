import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type { CustomerHomeFeed, CustomerHomeQuery } from '../types/customer-home.types';

const BASE = '/api/v1/customer/home';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

export const getCustomerHomeFeed = async (query: CustomerHomeQuery): Promise<CustomerHomeFeed> => {
  const response = await apiClient.get<ApiSuccessResponse<CustomerHomeFeed>>(BASE, {
    params: query,
  });
  return unwrapData(response.data);
};
