export const normalizeLedgerAccountCode = (accountCode: string): string =>
  accountCode
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .replace(/_+/g, '_')
    .toUpperCase();
