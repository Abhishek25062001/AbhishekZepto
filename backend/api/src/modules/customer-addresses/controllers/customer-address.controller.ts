import { sendCreatedResponse, sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import type { CustomerAddressAuditContext } from '../services/customer-address.service';
import {
  createCustomerAddress,
  deleteCustomerAddress,
  listCustomerAddresses,
  setDefaultCustomerAddress,
  updateCustomerAddress,
} from '../services/customer-address.service';
import type {
  CreateCustomerAddressInput,
  UpdateCustomerAddressInput,
} from '../types/customer-address.types';

const requireCustomerId = (userId?: string): string => userId ?? '';

const buildAuditContext = (req: {
  user?: { userId?: string };
  requestId?: string;
  traceId?: string;
}): CustomerAddressAuditContext => ({
  actorId: requireCustomerId(req.user?.userId),
  requestId: req.requestId ?? null,
  traceId: req.traceId ?? null,
});

const requireAddressId = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : '';

export const listCustomerAddressesController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const addresses = await listCustomerAddresses(customerId);

  return sendSuccessResponse({
    res,
    message: 'Customer addresses fetched successfully',
    data: addresses,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const createCustomerAddressController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const address = await createCustomerAddress(
    customerId,
    req.body as CreateCustomerAddressInput,
    buildAuditContext(req),
  );

  return sendCreatedResponse({
    res,
    message: 'Customer address created successfully',
    data: address,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const updateCustomerAddressController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const addressId = requireAddressId(req.params.addressId);
  const address = await updateCustomerAddress(
    customerId,
    addressId,
    req.body as UpdateCustomerAddressInput,
    buildAuditContext(req),
  );

  return sendSuccessResponse({
    res,
    message: 'Customer address updated successfully',
    data: address,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const deleteCustomerAddressController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const addressId = requireAddressId(req.params.addressId);
  await deleteCustomerAddress(customerId, addressId, buildAuditContext(req));

  return sendSuccessResponse({
    res,
    message: 'Customer address deleted successfully',
    data: { addressId },
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const setDefaultCustomerAddressController = asyncHandler(async (req, res) => {
  const customerId = requireCustomerId(req.user?.userId);
  const addressId = requireAddressId(req.params.addressId);
  const address = await setDefaultCustomerAddress(
    customerId,
    addressId,
    buildAuditContext(req),
  );

  return sendSuccessResponse({
    res,
    message: 'Default customer address updated successfully',
    data: address,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
