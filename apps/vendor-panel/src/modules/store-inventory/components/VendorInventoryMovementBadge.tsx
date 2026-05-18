import { Badge } from '../../../components/common';
import {
  VENDOR_MOVEMENT_TYPE_LABELS,
  type InventoryMovementType,
} from '../constants/vendor-inventory.constants';

export function VendorInventoryMovementBadge({ movementType }: { movementType: InventoryMovementType }) {
  const variant =
    movementType === 'stock_in'
      ? 'success'
      : movementType === 'stock_out'
        ? 'warning'
        : 'neutral';
  return <Badge variant={variant}>{VENDOR_MOVEMENT_TYPE_LABELS[movementType]}</Badge>;
}
