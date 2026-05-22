import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  CancelCheckoutInput,
  CheckoutSessionResponse,
  GetCheckoutSummaryQuery,
  InitiateCheckoutInput,
  InitiateCheckoutResponse,
} from '../types/checkout.types';

const BASE = '/api/v1/customer/checkout';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

export const initiateCheckout = async (
  input: InitiateCheckoutInput,
): Promise<InitiateCheckoutResponse> => {
  const response = await apiClient.post<ApiSuccessResponse<InitiateCheckoutResponse>>(
    `${BASE}/initiate`,
    input,
  );
  return unwrapData(response.data);
};

export const getCheckoutSummary = async (
  query?: GetCheckoutSummaryQuery,
): Promise<CheckoutSessionResponse> => {
  const response = await apiClient.get<ApiSuccessResponse<CheckoutSessionResponse>>(
    `${BASE}/summary`,
    { params: query },
  );
  return unwrapData(response.data);
};

export const cancelCheckout = async (input: CancelCheckoutInput): Promise<CheckoutSessionResponse> => {
  const response = await apiClient.post<ApiSuccessResponse<CheckoutSessionResponse>>(
    `${BASE}/cancel`,
    input,
  );
  return unwrapData(response.data);
};
