import assert from 'node:assert/strict';
import { test } from 'node:test';

import { PRODUCT_APPROVAL_STATUS } from '../constants/product.constants';
import { productApprovalSchema } from './product-approval.schema';

test('productApprovalSchema requires a reason when rejecting', () => {
  const invalid = productApprovalSchema.safeParse({
    approvalStatus: PRODUCT_APPROVAL_STATUS.REJECTED,
    rejectionReason: '',
  });

  assert.equal(invalid.success, false);
});

test('productApprovalSchema allows omissions for non-rejected states', () => {
  const valid = productApprovalSchema.safeParse({
    approvalStatus: PRODUCT_APPROVAL_STATUS.APPROVED,
  });

  assert.equal(valid.success, true);
});
