import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  extractExtension,
  generateStoredFileName,
  sanitizeOriginalFileName,
} from './media-file-name.util';

test('sanitizeOriginalFileName strips unsafe characters', () => {
  assert.equal(sanitizeOriginalFileName('my file (1).png'), 'my_file__1_.png');
});

test('generateStoredFileName includes extension', () => {
  const stored = generateStoredFileName('photo.JPG');
  assert.match(stored, /^\d+_[a-f0-9]+\.jpg$/);
});

test('extractExtension returns extension without dot', () => {
  assert.equal(extractExtension('archive.tar.gz'), 'gz');
  assert.equal(extractExtension('noext'), '');
});
