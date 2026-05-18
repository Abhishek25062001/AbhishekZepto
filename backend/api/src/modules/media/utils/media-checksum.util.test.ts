import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { generateFileChecksum } from './media-checksum.util';

test('generateFileChecksum is deterministic for known buffer', () => {
  const buffer = Buffer.from('zepto-media-test');
  const expected = createHash('sha256').update(buffer).digest('hex');
  assert.equal(generateFileChecksum(buffer), expected);
});
