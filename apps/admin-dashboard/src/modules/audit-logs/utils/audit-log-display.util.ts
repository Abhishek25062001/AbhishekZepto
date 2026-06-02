export const formatAuditLogDate = (value?: string | null): string => {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const formatAuditLogLabel = (value: string): string => value
  .split('_')
  .join(' ')
  .replace(/\b\w/g, character => character.toUpperCase());

export const truncateAuditValue = (value?: string | null): string => {
  if (!value) return 'Not available';
  return value.length > 28 ? `${value.slice(0, 28)}...` : value;
};
