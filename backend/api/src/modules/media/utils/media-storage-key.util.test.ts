import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MEDIA_FILE_PURPOSE } from '../constants/media-file-purpose.constant';
import { MEDIA_OWNER_TYPE } from '../constants/media-owner-type.constant';
import { buildStorageKey } from './media-storage-key.util';

test('buildStorageKey uses purpose folder and owner segment', () => {
  const key = buildStorageKey(
    MEDIA_FILE_PURPOSE.CATEGORY_ICON,
    MEDIA_OWNER_TYPE.CATEGORY,
    '507f1f77bcf86cd799439011',
    '1700000000_abcd.png',
  );
  assert.equal(key, 'catalog/categories/507f1f77bcf86cd799439011/1700000000_abcd.png');
});

test('buildStorageKey falls back to general folder', () => {
  const key = buildStorageKey(MEDIA_FILE_PURPOSE.GENERAL, null, null, 'file.pdf');
  assert.equal(key, 'general/file.pdf');
});
