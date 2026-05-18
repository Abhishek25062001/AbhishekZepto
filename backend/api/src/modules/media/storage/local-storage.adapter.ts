import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../../../config/env';
import { STORAGE_PROVIDER } from '../constants/storage-provider.constant';
import type { StorageAdapter, StorageUploadInput } from '../types/storage-adapter.types';

const resolveLocalPath = (storageKey: string): string =>
  path.join(env.MEDIA_LOCAL_UPLOAD_DIR, storageKey);

export const createLocalStorageAdapter = (): StorageAdapter => ({
  provider: STORAGE_PROVIDER.LOCAL,

  async uploadFile(input: StorageUploadInput): Promise<{ publicUrl: string }> {
    const filePath = resolveLocalPath(input.storageKey);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, input.buffer);
    const publicUrl = `${env.MEDIA_PUBLIC_BASE_URL.replace(/\/$/, '')}/${input.storageKey}`;
    return { publicUrl };
  },

  async deleteFile(storageKey: string): Promise<void> {
    const filePath = resolveLocalPath(storageKey);
    try {
      await fs.unlink(filePath);
    } catch {
      // ignore missing file on delete
    }
  },

  getPublicUrl(storageKey: string): string {
    return `${env.MEDIA_PUBLIC_BASE_URL.replace(/\/$/, '')}/${storageKey}`;
  },

  async getSignedUrl(storageKey: string): Promise<string> {
    return this.getPublicUrl(storageKey);
  },

  async fileExists(storageKey: string): Promise<boolean> {
    try {
      await fs.access(resolveLocalPath(storageKey));
      return true;
    } catch {
      return false;
    }
  },
});
