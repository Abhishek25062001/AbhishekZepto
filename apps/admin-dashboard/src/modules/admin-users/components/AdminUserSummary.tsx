import { Badge } from '../../../components/common';
import type { AdminUserSummary as AdminUserSummaryData } from '../types/admin-users.types';
import {
  formatAdminUserDate,
  formatAdminUserLabel,
  getAdminUserStatusVariant,
} from '../utils/admin-users-display.util';

type AdminUserSummaryProps = {
  user: AdminUserSummaryData;
};

const rowStyle = {
  display: 'grid',
  gap: 4,
} as const;

const labelStyle = {
  color: 'var(--color-text-secondary)',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
} as const;

export function AdminUserSummary({ user }: AdminUserSummaryProps) {
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        display: 'grid',
        gap: 'var(--spacing-lg)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        padding: 'var(--spacing-lg)',
      }}
    >
      <div style={rowStyle}>
        <span style={labelStyle}>Name</span>
        <strong>{user.name ?? 'Unnamed admin'}</strong>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Phone</span>
        <span>{user.phone}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Email</span>
        <span>{user.email ?? '—'}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Role</span>
        <span>{formatAdminUserLabel(user.role)}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Status</span>
        <Badge variant={getAdminUserStatusVariant(user.status)}>
          {formatAdminUserLabel(user.status)}
        </Badge>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Permissions</span>
        <span>{user.permissions.length}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>City Scope</span>
        <span>{user.cityScope.length > 0 ? user.cityScope.join(', ') : 'All'}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Store Scope</span>
        <span>{user.storeScope.length > 0 ? user.storeScope.join(', ') : 'All'}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Last Login</span>
        <span>{formatAdminUserDate(user.lastLoginAt)}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Updated</span>
        <span>{formatAdminUserDate(user.updatedAt)}</span>
      </div>
    </section>
  );
}

