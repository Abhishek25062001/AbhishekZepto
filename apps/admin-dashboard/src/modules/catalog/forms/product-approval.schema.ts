import { z } from 'zod';

import { PRODUCT_APPROVAL_STATUS } from '../constants/product.constants';

export const productApprovalSchema = z
  .object({
    approvalStatus: z.enum([
      PRODUCT_APPROVAL_STATUS.DRAFT,
      PRODUCT_APPROVAL_STATUS.PENDING_REVIEW,
      PRODUCT_APPROVAL_STATUS.APPROVED,
      PRODUCT_APPROVAL_STATUS.REJECTED,
      PRODUCT_APPROVAL_STATUS.ARCHIVED,
    ]),
    rejectionReason: z
      .string()
      .optional()
      .transform((value) => (value === '' ? undefined : value)),
  })
  .superRefine((data, context) => {
    if (data.approvalStatus === PRODUCT_APPROVAL_STATUS.REJECTED) {
      const reason = data.rejectionReason?.trim();
      if (!reason) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Rejection reason is required.',
          path: ['rejectionReason'],
        });
      }
    }
  });

export type ProductApprovalFormValues = z.infer<typeof productApprovalSchema>;
