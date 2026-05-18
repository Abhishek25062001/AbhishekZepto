import { Badge } from '../../../components/common';
import {
  PRODUCT_APPROVAL_STATUS_LABELS,
  STORE_PRODUCT_STATUS_LABELS,
  type ProductApprovalDisplayStatus,
  type StoreProductStatus,
} from '../constants/vendor-store-product.constants';

const approvalVariant: Record<ProductApprovalDisplayStatus, 'success' | 'warning' | 'error'> = {
  approved: 'success',
  pending_review: 'warning',
  rejected: 'error',
};

const statusVariant: Record<StoreProductStatus, 'success' | 'neutral' | 'warning'> = {
  active: 'success',
  inactive: 'neutral',
  archived: 'warning',
};

export function VendorCatalogApprovalBadge({ status }: { status: ProductApprovalDisplayStatus }) {
  return <Badge variant={approvalVariant[status]}>{PRODUCT_APPROVAL_STATUS_LABELS[status]}</Badge>;
}

export function VendorCatalogStatusBadge({ status }: { status: StoreProductStatus }) {
  return <Badge variant={statusVariant[status]}>{STORE_PRODUCT_STATUS_LABELS[status]}</Badge>;
}

export function VendorAvailabilityBadge({ isAvailable }: { isAvailable: boolean }) {
  return <Badge variant={isAvailable ? 'success' : 'warning'}>{isAvailable ? 'Available' : 'Unavailable'}</Badge>;
}
