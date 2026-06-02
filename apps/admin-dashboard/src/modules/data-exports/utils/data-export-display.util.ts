export const formatDataExportLabel = (value: string): string =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const formatDataExportDate = (value: string | null): string => {
  if (!value) return 'Not available';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const truncateDataExportValue = (value: string | null, maxLength = 18): string => {
  if (!value) return 'Not available';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
};
