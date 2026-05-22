import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  CreatePaymentOrderInput,
  CreatePaymentOrderResponse,
  VerifyPaymentInput,
  VerifyPaymentResponse,
} from '../types/payment.types';

const BASE = '/api/v1/customer/payments';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

export const createPaymentOrder = async (
  input: CreatePaymentOrderInput,
): Promise<CreatePaymentOrderResponse> => {
  const response = await apiClient.post<ApiSuccessResponse<CreatePaymentOrderResponse>>(
    `${BASE}/create-order`,
    input,
  );
  return unwrapData(response.data);
};

export const verifyPayment = async (input: VerifyPaymentInput): Promise<VerifyPaymentResponse> => {
  const response = await apiClient.post<ApiSuccessResponse<VerifyPaymentResponse>>(
    `${BASE}/verify`,
    input,
  );
  return unwrapData(response.data);
};
