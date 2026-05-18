import { authPaths } from './auth.paths';
import { catalogPaths } from './catalog.paths';
import { locationPaths } from './location.paths';
import { inventoryPaths } from './inventory.paths';
import { inventoryLockPaths } from './inventory-lock.paths';
import { mediaPaths } from './media.paths';
import { storeProductPaths } from './store-product.paths';
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
  catalogPaths,
  locationPaths,
  inventoryPaths,
  inventoryLockPaths,
  mediaPaths,
  storeProductPaths,
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
    ...catalogPaths,
    ...locationPaths,
    ...storeProductPaths,
    ...inventoryPaths,
    ...inventoryLockPaths,
    ...mediaPaths,
  },
};
