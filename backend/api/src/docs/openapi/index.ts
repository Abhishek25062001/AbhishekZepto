import { authPaths } from './auth.paths';
import {
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  HealthResponseSchema,
  PaginationMetaSchema,
  SystemInfoResponseSchema,
  VersionResponseSchema,
} from './common.schemas';
import { openApiConfig } from './openapi.config';
import { publicPaths } from './public.paths';

export {
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  authPaths,
  HealthResponseSchema,
  openApiConfig,
  PaginationMetaSchema,
  publicPaths,
  SystemInfoResponseSchema,
  VersionResponseSchema,
};

export const openApiDocument = {
  ...openApiConfig,
  components: {
    schemas: {
      ApiErrorResponse: ApiErrorResponseSchema,
      ApiSuccessResponse: ApiSuccessResponseSchema,
      HealthResponse: HealthResponseSchema,
      PaginationMeta: PaginationMetaSchema,
      SystemInfoResponse: SystemInfoResponseSchema,
      VersionResponse: VersionResponseSchema,
    },
  },
  paths: {
    ...publicPaths,
    ...authPaths,
  },
};
