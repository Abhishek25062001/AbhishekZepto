import { authPaths } from './auth.paths';
import { catalogPaths } from './catalog.paths';
import { locationPaths } from './location.paths';
import { inventoryPaths } from './inventory.paths';
import { inventoryLockPaths } from './inventory-lock.paths';
import { mediaPaths } from './media.paths';
import { orderPaths } from './order.paths';
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
import { deliveryPaths } from './delivery.paths';
import { controlTowerPaths } from './control-tower.paths';
import { pushNotificationPaths } from './push-notification.paths';
import { inAppNotificationPaths } from './in-app-notification.paths';
import { realtimePaths } from './realtime.paths';
import { adminControlPaths } from './admin-control.paths';
import { adminUserPaths } from './admin-user.paths';
import { customerManagementPaths } from './customer-management.paths';
import { deliveryAgentManagementPaths } from './delivery-agent-management.paths';
import { vendorStoreManagementPaths } from './vendor-store-management.paths';
import { supportOperationsPaths } from './support-operations.paths';
import { platformSettingsPaths } from './platform-settings.paths';
import { auditLogSystemPaths } from './audit-log-system.paths';
import { operationalAnalyticsPaths } from './operational-analytics.paths';
import { adminDataExportPaths } from './admin-data-export.paths';

export {
  ApiErrorResponseSchema,
  ApiSuccessResponseSchema,
  authPaths,
  catalogPaths,
  locationPaths,
  inventoryPaths,
  inventoryLockPaths,
  mediaPaths,
  orderPaths,
  storeProductPaths,
  HealthResponseSchema,
  openApiConfig,
  PaginationMetaSchema,
  publicPaths,
  deliveryPaths,
  controlTowerPaths,
  pushNotificationPaths,
  inAppNotificationPaths,
  realtimePaths,
  adminControlPaths,
  adminUserPaths,
  customerManagementPaths,
  deliveryAgentManagementPaths,
  vendorStoreManagementPaths,
  supportOperationsPaths,
  platformSettingsPaths,
  auditLogSystemPaths,
  operationalAnalyticsPaths,
  adminDataExportPaths,
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
    ...orderPaths,
    ...deliveryPaths,
    ...controlTowerPaths,
    ...pushNotificationPaths,
    ...inAppNotificationPaths,
    ...realtimePaths,
    ...adminControlPaths,
    ...adminUserPaths,
    ...customerManagementPaths,
    ...deliveryAgentManagementPaths,
    ...vendorStoreManagementPaths,
    ...supportOperationsPaths,
    ...platformSettingsPaths,
    ...auditLogSystemPaths,
    ...operationalAnalyticsPaths,
    ...adminDataExportPaths,
  },
};
