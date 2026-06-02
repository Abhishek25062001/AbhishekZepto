export const formatVendorStoreLabel = (value: string): string =>
  value.replace(/_/g, ' ').replace(/\b\w/g, character => character.toUpperCase());

export const formatVendorStoreDate = (value?: string | null): string => {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString();
};

export const formatVendorStoreMoney = (value: number, currency = 'INR'): string =>
  new Intl.NumberFormat('en-IN', { currency, style: 'currency' }).format(value);

export const getVendorStoreStatusVariant = (
  status?: string | null,
): 'success' | 'warning' | 'error' | 'neutral' => {
  if (status === 'active') {
    return 'success';
  }

  if (status === 'inactive' || status === 'pending_approval') {
    return 'warning';
  }

  if (status === 'blocked' || status === 'suspended' || status === 'archived') {
    return 'error';
  }

  return 'neutral';
};

export const getBooleanStatusVariant = (enabled: boolean): 'success' | 'neutral' =>
  enabled ? 'success' : 'neutral';
