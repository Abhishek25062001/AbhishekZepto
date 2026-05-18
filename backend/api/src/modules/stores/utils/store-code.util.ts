export const generateStoreCode = (sequence: number): string => {
  if (!Number.isFinite(sequence) || sequence < 0) {
    throw new RangeError('Store code sequence must be a non-negative finite number');
  }
  const n = Math.floor(sequence);
  return `STORE-${String(n).padStart(6, '0')}`;
};
