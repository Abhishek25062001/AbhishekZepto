import { Badge } from '../../../components/common';
import type { CatalogStatus } from '../constants/catalog-status.constants';
import { CATALOG_STATUS_LABELS } from '../constants/catalog-status.constants';

const statusVariantMap: Record<CatalogStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  active: 'success',
  archived: 'error',
  inactive: 'warning',
};

type CatalogStatusBadgeProps = {
  status: CatalogStatus;
};

export function CatalogStatusBadge({ status }: CatalogStatusBadgeProps) {
  return <Badge variant={statusVariantMap[status]}>{CATALOG_STATUS_LABELS[status]}</Badge>;
}
