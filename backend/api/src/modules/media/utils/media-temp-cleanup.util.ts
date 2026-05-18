import fs from 'node:fs/promises';

export const cleanupTempFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore missing temp files
  }
};
