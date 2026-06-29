export const formatJournalCode = (date: Date, sequence: number): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const suffix = String(sequence).padStart(6, '0');

  return `JRN-${year}${month}${day}-${suffix}`;
};

export const buildJournalCodePrefixForDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `JRN-${year}${month}${day}-`;
};
