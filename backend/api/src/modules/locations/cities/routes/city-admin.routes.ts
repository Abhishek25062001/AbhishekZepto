import { Router } from 'express';
import { validateRequest } from '../../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../../auth/utils/permission-code.util';
import {
  createCityController,
  deleteCityController,
  getCityByIdController,
  listCitiesController,
  updateCityController,
} from '../controllers/city.controller';
import {
  cityIdParamsValidator,
  createCityBodyValidator,
  listCitiesQueryValidator,
  updateCityBodyValidator,
} from '../validators/city.validators';

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
  validateRequest({ query: listCitiesQueryValidator }),
  listCitiesController,
);

router.post(
  '/',
  requirePermission(locationsCreate),
  validateRequest({ body: createCityBodyValidator }),
  createCityController,
);

router.get(
  '/:cityId',
  requirePermission(locationsRead),
  validateRequest({ params: cityIdParamsValidator }),
  getCityByIdController,
);

router.patch(
  '/:cityId',
  requirePermission(locationsUpdate),
  validateRequest({ params: cityIdParamsValidator }),
  validateRequest({ body: updateCityBodyValidator }),
  updateCityController,
);

router.delete(
  '/:cityId',
  requirePermission(locationsDelete),
  validateRequest({ params: cityIdParamsValidator }),
  deleteCityController,
);

export default router;
