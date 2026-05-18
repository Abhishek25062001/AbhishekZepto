import { Badge } from '../../../components/common';
import type { MovementType } from '../constants/inventory.constants';
import { MOVEMENT_TYPE_LABELS } from '../constants/inventory.constants';

const variantMap: Record<MovementType, 'success' | 'warning' | 'error' | 'neutral'> = {
  stock_in: 'success',
  stock_out: 'warning',
  manual_adjustment: 'neutral',
  reservation_created: 'neutral',
  reservation_released: 'neutral',
  reservation_confirmed: 'success',
  damaged: 'error',
  expired: 'error',
  correction: 'neutral',
};

export function InventoryMovementBadge({ movementType }: { movementType: MovementType }) {
  return <Badge variant={variantMap[movementType]}>{MOVEMENT_TYPE_LABELS[movementType]}</Badge>;
}
