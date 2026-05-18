import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MEDIA_FILE_CATEGORY } from '../constants/media-file-category.constant';
import { detectFileCategory } from './media-category.util';

test('detectFileCategory maps image MIME types', () => {
  assert.equal(detectFileCategory('image/png'), MEDIA_FILE_CATEGORY.IMAGE);
});

test('detectFileCategory maps document and video MIME types', () => {
  assert.equal(detectFileCategory('application/pdf'), MEDIA_FILE_CATEGORY.DOCUMENT);
  assert.equal(detectFileCategory('video/mp4'), MEDIA_FILE_CATEGORY.VIDEO);
});
