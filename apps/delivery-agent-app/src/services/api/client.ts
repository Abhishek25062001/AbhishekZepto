import axios, { AxiosError } from 'axios';

import { API_BASE_URL, isDevelopment } from '../../config/env';
import type { ApiErrorResponse } from '../../types/api.types';
import { useAuthStore } from '../../store/auth.store';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (!config.headers['x-trace-id']) {
    config.headers['x-trace-id'] = `delivery-agent-app-${Date.now()}`;
  }

  if (isDevelopment) {
    console.debug('Delivery Agent App API request', {
      method: config.method,
      url: config.url,
      traceId: config.headers?.['x-trace-id'],
      authorization: config.headers?.Authorization ? '[redacted]' : undefined,
      accessToken: config.headers?.accessToken ? '[redacted]' : undefined,
      refreshToken: config.headers?.refreshToken ? '[redacted]' : undefined,
    });
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.debug('Delivery Agent App API response', {
        status: response.status,
        url: response.config.url,
        responseTime: 'not_measured',
      });
    }

    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Automatic refresh on 401 is intentionally deferred to the session module.
    if (isDevelopment) {
      console.debug('Delivery Agent App API response error', {
        status: error.response?.status,
        url: error.config?.url,
        responseTime: 'not_measured',
      });
    }

    return Promise.reject(error);
  },
);
