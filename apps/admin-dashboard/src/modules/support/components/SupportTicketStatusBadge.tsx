import { Badge } from '../../../components/common';
import type { SupportTicketStatus } from '../types/support.types';
import { formatSupportLabel, getSupportStatusVariant } from '../utils/support-display.util';

export function SupportTicketStatusBadge({ status }: { status: SupportTicketStatus }) {
  return <Badge variant={getSupportStatusVariant(status)}>{formatSupportLabel(status)}</Badge>;
}
