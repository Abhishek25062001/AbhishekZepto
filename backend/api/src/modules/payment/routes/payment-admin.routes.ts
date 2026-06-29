import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  getAdminPaymentByIdController,
  listAdminPaymentsController,
} from '../controllers/payment.controller';
import {
  listAdminPaymentsQueryValidator,
  paymentIdParamsValidator,
} from '../validators/payment.validators';

const router = Router();

const financePaymentsRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.FINANCE_PAYMENTS,
  AUTH_PERMISSION_ACTION.READ,
);

router.get(
  '/',
  requirePermission(financePaymentsRead),
  validateRequest({ query: listAdminPaymentsQueryValidator }),
  listAdminPaymentsController,
);

router.get(
  '/:paymentId',
  requirePermission(financePaymentsRead),
  validateRequest({ params: paymentIdParamsValidator }),
  getAdminPaymentByIdController,
);

export default router;
