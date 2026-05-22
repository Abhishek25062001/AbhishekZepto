import { Badge } from '../../../components/common';

export function VendorOrderSlaBadge({ slaStatus }: { slaStatus: string | null }) {
  if (!slaStatus) {
    return <Badge variant="neutral">Needs verification</Badge>;
  }

  const variant = slaStatus === 'breached' ? 'error' : slaStatus === 'at_risk' ? 'warning' : 'success';
  return <Badge variant={variant}>{slaStatus.replaceAll('_', ' ')}</Badge>;
}
