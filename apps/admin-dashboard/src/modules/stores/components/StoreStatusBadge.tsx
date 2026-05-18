import { Badge } from '../../../components/common';
import type { LocationStatus, StoreStatus } from '../constants/store.constants';
import { LOCATION_STATUS_LABELS, STORE_STATUS_LABELS } from '../constants/store.constants';

const locationVariantMap: Record<LocationStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  active: 'success',
  archived: 'error',
  inactive: 'warning',
};

const storeVariantMap: Record<StoreStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  active: 'success',
  archived: 'error',
  inactive: 'warning',
  suspended: 'error',
};

type LocationStatusBadgeProps = { status: LocationStatus };

export function LocationStatusBadge({ status }: LocationStatusBadgeProps) {
  return <Badge variant={locationVariantMap[status]}>{LOCATION_STATUS_LABELS[status]}</Badge>;
}

type StoreStatusBadgeProps = { status: StoreStatus };

export function StoreStatusBadge({ status }: StoreStatusBadgeProps) {
  return <Badge variant={storeVariantMap[status]}>{STORE_STATUS_LABELS[status]}</Badge>;
}

export function StoreOpenBadge({ isOpen }: { isOpen: boolean }) {
  return <Badge variant={isOpen ? 'success' : 'warning'}>{isOpen ? 'Open' : 'Closed'}</Badge>;
}
