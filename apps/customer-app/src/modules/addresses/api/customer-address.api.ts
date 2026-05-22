import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  CreateCustomerAddressInput,
  CustomerAddress,
  UpdateCustomerAddressInput,
} from '../types/customer-address.types';
import type {
  SelectStoreInput,
  ServiceabilityInput,
  ServiceabilityResult,
  StoreSelectionResult,
} from '../types/serviceability.types';

const ADDRESS_BASE = '/api/v1/customer/addresses';
const SERVICEABILITY_BASE = '/api/v1/customer/serviceability';
const STORE_SELECTION_BASE = '/api/v1/customer/store-selection';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

export const listCustomerAddresses = async (): Promise<CustomerAddress[]> => {
  const response = await apiClient.get<ApiSuccessResponse<CustomerAddress[]>>(ADDRESS_BASE);
  return unwrapData(response.data);
};

export const createCustomerAddress = async (
  input: CreateCustomerAddressInput,
): Promise<CustomerAddress> => {
  const response = await apiClient.post<ApiSuccessResponse<CustomerAddress>>(ADDRESS_BASE, input);
  return unwrapData(response.data);
};

export const updateCustomerAddress = async (
  addressId: string,
  input: UpdateCustomerAddressInput,
): Promise<CustomerAddress> => {
  const response = await apiClient.patch<ApiSuccessResponse<CustomerAddress>>(
    `${ADDRESS_BASE}/${addressId}`,
    input,
  );
  return unwrapData(response.data);
};

export const deleteCustomerAddress = async (addressId: string): Promise<void> => {
  await apiClient.delete(`${ADDRESS_BASE}/${addressId}`);
};

export const setDefaultCustomerAddress = async (addressId: string): Promise<CustomerAddress> => {
  const response = await apiClient.post<ApiSuccessResponse<CustomerAddress>>(
    `${ADDRESS_BASE}/${addressId}/set-default`,
  );
  return unwrapData(response.data);
};

export const checkServiceability = async (
  input: ServiceabilityInput,
): Promise<ServiceabilityResult> => {
  const response = await apiClient.post<ApiSuccessResponse<ServiceabilityResult>>(
    SERVICEABILITY_BASE,
    input,
  );
  return unwrapData(response.data);
};

export const selectStoreForCustomer = async (
  input: SelectStoreInput,
): Promise<StoreSelectionResult> => {
  const response = await apiClient.post<ApiSuccessResponse<StoreSelectionResult>>(
    STORE_SELECTION_BASE,
    input,
  );
  return unwrapData(response.data);
};
