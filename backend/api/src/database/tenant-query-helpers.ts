type TenantScopeValue = string | null | undefined;

export type TenantScopeQueryInput = {
  vendorId?: TenantScopeValue;
  storeId?: TenantScopeValue;
  cityId?: TenantScopeValue;
  customerId?: TenantScopeValue;
  deliveryAgentId?: TenantScopeValue;
};

export type ResolvedTenantScopeQuery = {
  vendorId: string | null;
  storeId: string | null;
  cityId: string | null;
  customerId: string | null;
  deliveryAgentId: string | null;
};

const normalizeTenantScopeValue = (
  value?: TenantScopeValue,
): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
};

const buildScopeFilter = (
  field: keyof ResolvedTenantScopeQuery,
  value?: TenantScopeValue,
) => {
  const normalizedValue = normalizeTenantScopeValue(value);

  if (!normalizedValue) {
    return {};
  }

  return {
    [field]: normalizedValue,
  };
};

export const normalizeTenantScopeQuery = (
  input: TenantScopeQueryInput,
): ResolvedTenantScopeQuery => {
  return {
    vendorId: normalizeTenantScopeValue(input.vendorId),
    storeId: normalizeTenantScopeValue(input.storeId),
    cityId: normalizeTenantScopeValue(input.cityId),
    customerId: normalizeTenantScopeValue(input.customerId),
    deliveryAgentId: normalizeTenantScopeValue(input.deliveryAgentId),
  };
};

export const buildVendorScopeFilter = (vendorId?: TenantScopeValue) => {
  return buildScopeFilter('vendorId', vendorId);
};

export const buildStoreScopeFilter = (storeId?: TenantScopeValue) => {
  return buildScopeFilter('storeId', storeId);
};

export const buildCityScopeFilter = (cityId?: TenantScopeValue) => {
  return buildScopeFilter('cityId', cityId);
};

export const buildCustomerScopeFilter = (customerId?: TenantScopeValue) => {
  return buildScopeFilter('customerId', customerId);
};

export const buildDeliveryAgentScopeFilter = (
  deliveryAgentId?: TenantScopeValue,
) => {
  return buildScopeFilter('deliveryAgentId', deliveryAgentId);
};

export const buildTenantScopeFilter = (
  input: TenantScopeQueryInput,
) => {
  return {
    ...buildVendorScopeFilter(input.vendorId),
    ...buildStoreScopeFilter(input.storeId),
    ...buildCityScopeFilter(input.cityId),
    ...buildCustomerScopeFilter(input.customerId),
    ...buildDeliveryAgentScopeFilter(input.deliveryAgentId),
  };
};
