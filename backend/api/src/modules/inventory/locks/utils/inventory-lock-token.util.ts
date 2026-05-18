import { randomBytes } from 'node:crypto';

export const generateInventoryLockToken = (): string => {
  const suffix = randomBytes(12).toString('base64url');
  return `lock_${suffix}`;
};
