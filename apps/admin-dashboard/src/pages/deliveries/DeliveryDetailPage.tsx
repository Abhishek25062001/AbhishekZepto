import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Badge, Loader, Modal } from '../../components/common';
import { useAdminDeliveryDetail } from '../../hooks/useAdminDeliveryDetail';
import { useAdminOverrideDelivery } from '../../hooks/useAdminOverrideDelivery';
import type { AdminDeliveryDetailResponse, DeliveryStatus } from '../../services/api/delivery.api';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStatusVariant(status: DeliveryStatus): 'warning' | 'info' | 'success' | 'error' | 'neutral' {
  if (status === 'pending_assignment') return 'warning';
  if (['assigned', 'en_route_to_store', 'arrived_at_store', 'picked_up'].includes(status)) return 'info';
  if (['en_route_to_customer', 'arrived_at_customer'].includes(status)) return 'neutral';
  if (status === 'delivered') return 'success';
  if (status === 'failed' || status === 'cancelled') return 'error';
  return 'neutral';
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatTs(ts: string | null): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleString();
}

const TERMINAL_STATES: DeliveryStatus[] = ['delivered', 'failed', 'cancelled'];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'baseline', padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--color-border)' }}>
      <span style={{ color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, minWidth: 200, textTransform: 'uppercase' }}>{label}</span>
      <span style={{ color: 'var(--color-text)', fontSize: 14 }}>{value}</span>
    </div>
  );
}

function TimelineEvent({ event, index }: { event: AdminDeliveryDetailResponse['timeline'][0]; index: number }) {
  const actorColor =
    event.actorType === 'admin' ? 'var(--color-warning)' :
    event.actorType === 'delivery_agent' ? 'var(--color-info)' :
    'var(--color-text-secondary)';

  return (
    <div
      id={`timeline-event-${index}`}
      style={{
        borderLeft: `3px solid ${actorColor}`,
        marginLeft: 8,
        paddingLeft: 'var(--spacing-md)',
        paddingBottom: 'var(--spacing-md)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
        <Badge variant={event.actorType === 'admin' ? 'warning' : event.actorType === 'delivery_agent' ? 'info' : 'neutral'}>
          {event.actorType}
        </Badge>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
          {formatStatus(event.fromStatus)} → <strong style={{ color: 'var(--color-text)' }}>{formatStatus(event.toStatus)}</strong>
        </span>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginLeft: 'auto' }}>
          {formatTs(event.createdAt)}
        </span>
      </div>
      {event.reason ? (
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, margin: '4px 0 0' }}>
          {event.reason}
        </p>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Override Modal
// ---------------------------------------------------------------------------

type OverrideModalProps = {
  deliveryId: string;
  open: boolean;
  onClose: () => void;
};

function OverrideModal({ deliveryId, open, onClose }: OverrideModalProps) {
  const [targetStatus, setTargetStatus] = useState<'cancelled' | 'failed'>('cancelled');
  const [reason, setReason] = useState('');
  const overrideMutation = useAdminOverrideDelivery(deliveryId);

  const handleSubmit = () => {
    if (reason.trim().length < 5) return;
    overrideMutation.mutate({ targetStatus, reason: reason.trim() }, {
      onSuccess: () => {
        setReason('');
        onClose();
      },
    });
  };

  return (
    <Modal
      footer={
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
          <button
            disabled={overrideMutation.isPending}
            id="override-cancel-btn"
            onClick={onClose}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              padding: 'var(--spacing-sm) var(--spacing-md)',
            }}
            type="button"
          >
            Cancel
          </button>
          <button
            disabled={reason.trim().length < 5 || overrideMutation.isPending}
            id="override-submit-btn"
            onClick={handleSubmit}
            style={{
              background: 'var(--color-error)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              cursor: reason.trim().length < 5 || overrideMutation.isPending ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: reason.trim().length < 5 || overrideMutation.isPending ? 0.5 : 1,
              padding: 'var(--spacing-sm) var(--spacing-md)',
            }}
            type="button"
          >
            {overrideMutation.isPending ? 'Applying…' : 'Apply Override'}
          </button>
        </div>
      }
      onClose={onClose}
      open={open}
      title="Override Delivery State"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
            Target Status *
          </span>
          <select
            id="override-target-status"
            onChange={(e) => setTargetStatus(e.target.value as 'cancelled' | 'failed')}
            style={{
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)',
              fontSize: 14,
              padding: 'var(--spacing-sm)',
            }}
            value={targetStatus}
          >
            <option value="cancelled">Cancelled</option>
            <option value="failed">Failed</option>
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
            Reason * (min 5 chars)
          </span>
          <textarea
            id="override-reason"
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the reason for overriding this delivery state…"
            rows={3}
            style={{
              background: 'var(--color-background)',
              border: `1px solid ${reason.trim().length > 0 && reason.trim().length < 5 ? 'var(--color-error)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)',
              fontSize: 14,
              padding: 'var(--spacing-sm)',
              resize: 'vertical',
            }}
            value={reason}
          />
          {reason.trim().length > 0 && reason.trim().length < 5 ? (
            <span style={{ color: 'var(--color-error)', fontSize: 12 }}>Reason must be at least 5 characters.</span>
          ) : null}
        </label>
        {overrideMutation.isError ? (
          <p style={{ color: 'var(--color-error)', fontSize: 13, margin: 0 }}>
            Override failed. Please try again.
          </p>
        ) : null}
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export function DeliveryDetailPage() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const { data, isLoading, error } = useAdminDeliveryDetail(deliveryId);
  const [overrideOpen, setOverrideOpen] = useState(false);

  if (isLoading) {
    return <Loader label="Loading delivery detail…" />;
  }

  if (error || !data) {
    return (
      <div>
        <Link id="back-to-deliveries-error" to="/deliveries">← Back to Deliveries</Link>
        <p style={{ color: 'var(--color-error)', marginTop: 'var(--spacing-lg)' }}>
          Failed to load delivery detail. The delivery may not exist.
        </p>
      </div>
    );
  }

  const isTerminal = TERMINAL_STATES.includes(data.deliveryStatus);

  return (
    <div id="delivery-detail-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* Override modal */}
      {deliveryId ? (
        <OverrideModal
          deliveryId={deliveryId}
          onClose={() => setOverrideOpen(false)}
          open={overrideOpen}
        />
      ) : null}

      {/* Back nav & header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
        <Link
          id="back-to-deliveries"
          style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}
          to="/deliveries"
        >
          ← Deliveries
        </Link>
        <span style={{ color: 'var(--color-border)' }}>/</span>
        <code style={{ fontSize: 14 }}>{data.deliveryId}</code>
        <Badge variant={getStatusVariant(data.deliveryStatus)}>
          {formatStatus(data.deliveryStatus)}
        </Badge>
        {!isTerminal ? (
          <button
            id="open-override-modal"
            onClick={() => setOverrideOpen(true)}
            style={{
              background: 'color-mix(in srgb, var(--color-error) 12%, var(--color-surface))',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-error)',
              cursor: 'pointer',
              fontWeight: 600,
              marginLeft: 'auto',
              padding: 'var(--spacing-sm) var(--spacing-md)',
            }}
            type="button"
          >
            ⚠ Override Delivery
          </button>
        ) : null}
      </div>

      <h1 style={{ margin: 0 }}>Delivery Detail</h1>

      {/* Core fields */}
      <section
        id="delivery-core-details"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-xl)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Assignment Info</h2>
        <DetailRow label="Delivery ID" value={<code>{data.deliveryId}</code>} />
        <DetailRow label="Order ID" value={<code>{data.orderId}</code>} />
        <DetailRow label="Store ID" value={<code>{data.storeId}</code>} />
        <DetailRow label="City ID" value={<code>{data.cityId}</code>} />
        <DetailRow label="Customer ID" value={<code>{data.customerId}</code>} />
        <DetailRow label="Agent ID" value={data.deliveryAgentId ? <code>{data.deliveryAgentId}</code> : <em>Unassigned</em>} />
        <DetailRow label="Assigned At" value={formatTs(data.assignedAt)} />
        <DetailRow label="Arrived at Store" value={formatTs(data.arrivedAtStoreAt)} />
        <DetailRow label="Picked Up" value={formatTs(data.pickedUpAt)} />
        <DetailRow label="En Route to Customer" value={formatTs(data.enRouteToCustomerAt)} />
        <DetailRow label="Arrived at Customer" value={formatTs(data.arrivedAtCustomerAt)} />
        <DetailRow label="Delivered At" value={formatTs(data.deliveredAt)} />
        {data.failedAt ? <DetailRow label="Failed At" value={formatTs(data.failedAt)} /> : null}
        {data.failureReason ? <DetailRow label="Failure Reason" value={data.failureReason} /> : null}
        {data.cancelledAt ? <DetailRow label="Cancelled At" value={formatTs(data.cancelledAt)} /> : null}
        {data.cancellationReason ? <DetailRow label="Cancellation Reason" value={data.cancellationReason} /> : null}
        <DetailRow label="Created At" value={formatTs(data.createdAt)} />
        <DetailRow label="Updated At" value={formatTs(data.updatedAt)} />
      </section>

      {/* Agent snapshot */}
      {data.agentSnapshot ? (
        <section
          id="delivery-agent-snapshot"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-xl)',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Assigned Rider</h2>
          <DetailRow label="Name" value={data.agentSnapshot.name} />
          <DetailRow label="Phone" value={<a href={`tel:${data.agentSnapshot.phone}`}>{data.agentSnapshot.phone}</a>} />
          <DetailRow label="Vehicle Type" value={data.agentSnapshot.vehicleType} />
          {data.agentSnapshot.vehicleNumber ? <DetailRow label="Vehicle Number" value={data.agentSnapshot.vehicleNumber} /> : null}
        </section>
      ) : null}

      {/* Timeline */}
      <section
        id="delivery-timeline"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-xl)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Timeline</h2>
        {data.timeline.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>No timeline events yet.</p>
        ) : (
          <div>
            {data.timeline.map((event, idx) => (
              <TimelineEvent event={event} index={idx} key={idx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
