import { randomBytes } from 'node:crypto';
import path from 'node:path';

export const sanitizeOriginalFileName = (originalFileName: string): string =>
  originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255);

export const generateStoredFileName = (originalFileName: string): string => {
  const extension = path.extname(originalFileName).toLowerCase() || '';
  const suffix = randomBytes(8).toString('hex');
  return `${Date.now()}_${suffix}${extension}`;
};

export const extractExtension = (fileName: string): string => {
  const ext = path.extname(fileName).toLowerCase();
  return ext.startsWith('.') ? ext.slice(1) : ext;
};
