import { sendCreatedResponse, sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  createInternalTenantAccessTestRecord,
  listTenantAccessTestsByCustomerScope,
  listTenantAccessTestsByDeliveryAgentScope,
  listTenantAccessTestsByVendorStoreScope,
} from '../services/tenant-access-test.service';

const getSingleParam = (value: string | string[] | undefined): string => {
  return typeof value === 'string' ? value : '';
};

export const createTenantAccessTestRecordController = asyncHandler(async (req, res) => {
  const record = await createInternalTenantAccessTestRecord(req.body);

  return sendCreatedResponse({
    res,
    message: 'Internal tenant access test record created',
    data: record,
  });
});

export const listVendorStoreTenantAccessTestRecordsController = asyncHandler(
  async (req, res) => {
    const records = await listTenantAccessTestsByVendorStoreScope({
      vendorId: getSingleParam(req.params.vendorId),
      storeId: getSingleParam(req.params.storeId),
    });

    return sendSuccessResponse({
      res,
      message: 'Internal tenant access vendor/store records loaded',
      data: {
        records,
      },
    });
  },
);

export const listCustomerTenantAccessTestRecordsController = asyncHandler(
  async (req, res) => {
    const records = await listTenantAccessTestsByCustomerScope({
      user: req.user,
      customerId: getSingleParam(req.params.customerId),
      requestContext: {
        requestId: req.requestId ?? null,
        traceId: req.traceId ?? null,
        ipAddress: req.ip ?? null,
        userAgent: req.get('user-agent') ?? null,
      },
    });

    return sendSuccessResponse({
      res,
      message: 'Internal tenant access customer records loaded',
      data: {
        records,
      },
    });
  },
);

export const listDeliveryAgentTenantAccessTestRecordsController = asyncHandler(
  async (req, res) => {
    const records = await listTenantAccessTestsByDeliveryAgentScope({
      user: req.user,
      deliveryAgentId: getSingleParam(req.params.deliveryAgentId),
      requestContext: {
        requestId: req.requestId ?? null,
        traceId: req.traceId ?? null,
        ipAddress: req.ip ?? null,
        userAgent: req.get('user-agent') ?? null,
      },
    });

    return sendSuccessResponse({
      res,
      message: 'Internal tenant access delivery-agent records loaded',
      data: {
        records,
      },
    });
  },
);
