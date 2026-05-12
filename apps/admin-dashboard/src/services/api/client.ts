import axios, { AxiosError } from 'axios';

import { API_BASE_URL, isDevelopment } from '../../config/env';
import type { ApiErrorResponse } from '../../types/api.types';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  // Access token injection is added by the auth implementation module.
  if (isDevelopment) {
    console.debug('Admin Dashboard API request', {
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
      console.debug('Admin Dashboard API response', {
        status: response.status,
        url: response.config.url,
        responseTime: 'not_measured',
      });
    }

    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Global API error mapping is added by the auth/session implementation modules.
    if (isDevelopment) {
      console.debug('Admin Dashboard API response error', {
        status: error.response?.status,
        url: error.config?.url,
        responseTime: 'not_measured',
      });
    }

    return Promise.reject(error);
  },
);
