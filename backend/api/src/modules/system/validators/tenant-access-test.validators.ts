import { z } from 'zod';
import { mongoObjectIdValidator } from '../../../validators/common.validators';
import {
  customerIdParamValidator,
  deliveryAgentIdParamValidator,
  vendorStoreScopeParamValidator,
} from '../../../validators/tenant.validators';

const optionalMongoObjectIdValidator = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}, mongoObjectIdValidator.optional());

export const createTenantAccessTestRecordValidator = {
  body: z
    .object({
      vendorId: optionalMongoObjectIdValidator,
      storeId: optionalMongoObjectIdValidator,
      cityId: optionalMongoObjectIdValidator,
      customerId: optionalMongoObjectIdValidator,
      deliveryAgentId: optionalMongoObjectIdValidator,
      label: z.string().trim().min(1).max(120),
    })
    .superRefine((value, context) => {
      const hasAtLeastOneScopeField = Boolean(
        value.vendorId ||
          value.storeId ||
          value.cityId ||
          value.customerId ||
          value.deliveryAgentId,
      );

      if (!hasAtLeastOneScopeField) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one tenant scope field is required',
          path: ['vendorId'],
        });
      }

      if (value.storeId && !value.vendorId) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'vendorId is required when storeId is provided',
          path: ['vendorId'],
        });
      }
    }),
};

export const vendorStoreTenantAccessLookupValidator = {
  params: vendorStoreScopeParamValidator,
};

export const customerTenantAccessLookupValidator = {
  params: customerIdParamValidator,
};

export const deliveryAgentTenantAccessLookupValidator = {
  params: deliveryAgentIdParamValidator,
};
