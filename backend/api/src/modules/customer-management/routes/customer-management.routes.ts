import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { requireAnyPermission } from '../../auth/middlewares/require-any-permission.middleware';
import { CUSTOMER_MANAGEMENT_PERMISSION_GROUPS } from '../constants/customer-management-permissions.constants';
import {
  getCustomerController,
  listCustomerAddressesController,
  listCustomerAuditController,
  listCustomerOrdersController,
  listCustomersController,
  updateCustomerNotesController,
  updateCustomerStatusController,
} from '../controllers/customer-management.controller';
import {
  customerIdParamValidator,
  customerOrdersQueryValidator,
  listCustomersQueryValidator,
  updateCustomerNotesValidator,
  updateCustomerStatusValidator,
} from '../validators/customer-management.validator';

const router = Router();

router.get('/', requireAnyPermission(CUSTOMER_MANAGEMENT_PERMISSION_GROUPS.READ), validateRequest(listCustomersQueryValidator), listCustomersController);
router.get('/:customerId', requireAnyPermission(CUSTOMER_MANAGEMENT_PERMISSION_GROUPS.READ), validateRequest(customerIdParamValidator), getCustomerController);
router.patch('/:customerId/status', requireAnyPermission(CUSTOMER_MANAGEMENT_PERMISSION_GROUPS.STATUS), validateRequest(customerIdParamValidator), validateRequest(updateCustomerStatusValidator), updateCustomerStatusController);
router.patch('/:customerId/notes', requireAnyPermission(CUSTOMER_MANAGEMENT_PERMISSION_GROUPS.NOTES), validateRequest(customerIdParamValidator), validateRequest(updateCustomerNotesValidator), updateCustomerNotesController);
router.get('/:customerId/orders', requireAnyPermission(CUSTOMER_MANAGEMENT_PERMISSION_GROUPS.READ), validateRequest(customerIdParamValidator), validateRequest(customerOrdersQueryValidator), listCustomerOrdersController);
router.get('/:customerId/addresses', requireAnyPermission(CUSTOMER_MANAGEMENT_PERMISSION_GROUPS.READ), validateRequest(customerIdParamValidator), listCustomerAddressesController);
router.get('/:customerId/audit', requireAnyPermission(CUSTOMER_MANAGEMENT_PERMISSION_GROUPS.AUDIT), validateRequest(customerIdParamValidator), listCustomerAuditController);

export default router;
