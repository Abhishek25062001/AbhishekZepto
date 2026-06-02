import { Badge } from '../../../components/common';
import type { SupportTicketPriority } from '../types/support.types';
import { formatSupportLabel, getSupportPriorityVariant } from '../utils/support-display.util';

export function SupportTicketPriorityBadge({ priority }: { priority: SupportTicketPriority }) {
  return <Badge variant={getSupportPriorityVariant(priority)}>{formatSupportLabel(priority)}</Badge>;
}
