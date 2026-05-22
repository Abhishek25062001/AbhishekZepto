import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  createCustomerAddressController,
  deleteCustomerAddressController,
  listCustomerAddressesController,
  setDefaultCustomerAddressController,
  updateCustomerAddressController,
} from '../controllers/customer-address.controller';
import {
  addressIdParamsValidator,
  createCustomerAddressBodyValidator,
  updateCustomerAddressBodyValidator,
} from '../validators/customer-address.validators';

const router = Router();

router.get('/', listCustomerAddressesController);

router.post(
  '/',
  validateRequest({ body: createCustomerAddressBodyValidator }),
  createCustomerAddressController,
);

router.patch(
  '/:addressId',
  validateRequest({
    params: addressIdParamsValidator,
    body: updateCustomerAddressBodyValidator,
  }),
  updateCustomerAddressController,
);

router.delete(
  '/:addressId',
  validateRequest({ params: addressIdParamsValidator }),
  deleteCustomerAddressController,
);

router.post(
  '/:addressId/set-default',
  validateRequest({ params: addressIdParamsValidator }),
  setDefaultCustomerAddressController,
);

export default router;
