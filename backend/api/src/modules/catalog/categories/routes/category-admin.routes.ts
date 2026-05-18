import { Router } from 'express';
import { validateRequest } from '../../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../../auth/utils/permission-code.util';
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryByIdController,
  listCategoriesController,
  updateCategoryController,
} from '../controllers/category.controller';
import {
  categoryIdParamsValidator,
  createCategoryBodyValidator,
  listCategoriesQueryValidator,
  updateCategoryBodyValidator,
} from '../validators/category.validators';

const router = Router();

const catalogRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CATALOG,
  AUTH_PERMISSION_ACTION.READ,
);
const catalogCreate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CATALOG,
  AUTH_PERMISSION_ACTION.CREATE,
);
const catalogUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CATALOG,
  AUTH_PERMISSION_ACTION.UPDATE,
);
const catalogDelete = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.CATALOG,
  AUTH_PERMISSION_ACTION.DELETE,
);

router.get(
  '/',
  requirePermission(catalogRead),
  validateRequest({ query: listCategoriesQueryValidator }),
  listCategoriesController,
);

router.post(
  '/',
  requirePermission(catalogCreate),
  validateRequest({ body: createCategoryBodyValidator }),
  createCategoryController,
);

router.get(
  '/:categoryId',
  requirePermission(catalogRead),
  validateRequest({ params: categoryIdParamsValidator }),
  getCategoryByIdController,
);

router.patch(
  '/:categoryId',
  requirePermission(catalogUpdate),
  validateRequest({ params: categoryIdParamsValidator }),
  validateRequest({ body: updateCategoryBodyValidator }),
  updateCategoryController,
);

router.delete(
  '/:categoryId',
  requirePermission(catalogDelete),
  validateRequest({ params: categoryIdParamsValidator }),
  deleteCategoryController,
);

export default router;
