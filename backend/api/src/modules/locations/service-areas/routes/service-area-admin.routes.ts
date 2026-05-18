import { Router } from 'express';
import { validateRequest } from '../../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../../auth/utils/permission-code.util';
import {
  createServiceAreaController,
  deleteServiceAreaController,
  getServiceAreaByIdController,
  listServiceAreasController,
  updateServiceAreaController,
} from '../controllers/service-area.controller';
import {
  createServiceAreaBodyValidator,
  listServiceAreasQueryValidator,
  serviceAreaIdParamsValidator,
  updateServiceAreaBodyValidator,
} from '../validators/service-area.validators';

const router = Router();

const locationsRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.LOCATIONS,
  AUTH_PERMISSION_ACTION.READ,
);
const locationsCreate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.LOCATIONS,
  AUTH_PERMISSION_ACTION.CREATE,
);
const locationsUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.LOCATIONS,
  AUTH_PERMISSION_ACTION.UPDATE,
);
const locationsDelete = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.LOCATIONS,
  AUTH_PERMISSION_ACTION.DELETE,
);

router.get(
  '/',
  requirePermission(locationsRead),
  validateRequest({ query: listServiceAreasQueryValidator }),
  listServiceAreasController,
);

router.post(
  '/',
  requirePermission(locationsCreate),
  validateRequest({ body: createServiceAreaBodyValidator }),
  createServiceAreaController,
);

router.get(
  '/:serviceAreaId',
  requirePermission(locationsRead),
  validateRequest({ params: serviceAreaIdParamsValidator }),
  getServiceAreaByIdController,
);

router.patch(
  '/:serviceAreaId',
  requirePermission(locationsUpdate),
  validateRequest({ params: serviceAreaIdParamsValidator }),
  validateRequest({ body: updateServiceAreaBodyValidator }),
  updateServiceAreaController,
);

router.delete(
  '/:serviceAreaId',
  requirePermission(locationsDelete),
  validateRequest({ params: serviceAreaIdParamsValidator }),
  deleteServiceAreaController,
);

export default router;
