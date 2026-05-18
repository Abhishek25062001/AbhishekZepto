export type TenantScopeKind =
  | 'vendor'
  | 'store'
  | 'city'
  | 'customer'
  | 'delivery_agent';

export type TenantScopeField =
  | 'vendorId'
  | 'storeId'
  | 'cityId'
  | 'customerId'
  | 'deliveryAgentId';

export type TenantScopeContext = {
  vendorId?: string | null;
  storeId?: string | null;
  cityId?: string | null;
  customerId?: string | null;
  deliveryAgentId?: string | null;
};

export type ResolvedTenantScope = {
  vendorId: string | null;
  storeId: string | null;
  cityId: string | null;
  customerId: string | null;
  deliveryAgentId: string | null;
};

export type TenantScopeRequirement = {
  kind: TenantScopeKind;
  field: TenantScopeField;
};

export type TenantScopedQueryFilter = Partial<
  Record<TenantScopeField, string>
>;
