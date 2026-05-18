import { z } from 'zod';
import { mongoObjectIdValidator } from './common.validators';

const optionalTenantScopeIdValidator = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}, mongoObjectIdValidator.optional());

export const vendorIdParamValidator = z.object({
  vendorId: mongoObjectIdValidator,
});

export const storeIdParamValidator = z.object({
  storeId: mongoObjectIdValidator,
});

export const cityIdParamValidator = z.object({
  cityId: mongoObjectIdValidator,
});

export const customerIdParamValidator = z.object({
  customerId: mongoObjectIdValidator,
});

export const deliveryAgentIdParamValidator = z.object({
  deliveryAgentId: mongoObjectIdValidator,
});

export const vendorStoreScopeParamValidator = z.object({
  vendorId: mongoObjectIdValidator,
  storeId: mongoObjectIdValidator,
});

export const tenantScopeQueryValidator = z.object({
  vendorId: optionalTenantScopeIdValidator,
  storeId: optionalTenantScopeIdValidator,
  cityId: optionalTenantScopeIdValidator,
  customerId: optionalTenantScopeIdValidator,
  deliveryAgentId: optionalTenantScopeIdValidator,
});
