export const formatDeliveryAgentLabel = (value: string): string =>
  value.replace(/_/g, ' ').replace(/\b\w/g, character => character.toUpperCase());

export const formatDeliveryAgentDate = (value?: string | null): string => {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString();
};

export const getDeliveryAgentActiveVariant = (
  isActive: boolean,
): 'success' | 'error' => isActive ? 'success' : 'error';

export const getDeliveryAgentAvailabilityVariant = (
  availabilityStatus: string,
): 'success' | 'neutral' | 'warning' => {
  if (availabilityStatus === 'online') {
    return 'success';
  }

  if (availabilityStatus === 'offline') {
    return 'neutral';
  }

  return 'warning';
};

export const getDeliveryAgentVerificationVariant = (
  isVerified: boolean,
): 'success' | 'warning' => isVerified ? 'success' : 'warning';

