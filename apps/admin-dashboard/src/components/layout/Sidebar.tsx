import { Link } from 'react-router-dom';
import type { PermissionCode } from '../../../../../packages/shared/api';
import { CanAccess } from '../auth/CanAccess';
import { CanAccessAny } from '../auth/CanAccessAny';

type NavLink = { label: string; permission: PermissionCode; to: string };

const navigationLinks: NavLink[] = [
  { label: 'Dashboard', to: '/dashboard', permission: 'auth:read' },
  { label: 'Users', to: '/users', permission: 'users:read' },
  { label: 'Orders', to: '/orders', permission: 'orders:read' },
  { label: 'Delivery Agents', to: '/delivery-agents', permission: 'delivery:read' },
  {
    label: 'Realtime Control Tower',
    to: '/realtime-control-tower',
    permission: 'realtime_control_tower:read',
  },
  { label: 'Finance', to: '/finance', permission: 'finance:read' },
  { label: 'Analytics', to: '/analytics', permission: 'reports:read' },
  { label: 'Exports', to: '/exports', permission: 'reports:export' },
  { label: 'Support', to: '/support', permission: 'support:read' },
  { label: 'Audit Logs', to: '/audit-logs', permission: 'audit_logs:read' },
  { label: 'Settings', to: '/settings', permission: 'settings:read' },
  { label: 'Platform Settings', to: '/settings/platform', permission: 'settings:read' },
];

const catalogLinks: NavLink[] = [
  { label: 'Categories', to: '/catalog/categories', permission: 'catalog:read' },
  { label: 'Brands', to: '/catalog/brands', permission: 'catalog:read' },
  { label: 'Units', to: '/catalog/units', permission: 'catalog:read' },
  { label: 'Products', to: '/catalog/products', permission: 'catalog:read' },
];

const locationLinks: NavLink[] = [
  { label: 'Cities', to: '/locations/cities', permission: 'locations:read' },
  { label: 'Service Areas', to: '/locations/service-areas', permission: 'locations:read' },
];

const inventoryLinks: NavLink[] = [
  { label: 'Store Products', to: '/store-products', permission: 'store_products:read' },
  { label: 'Stock', to: '/inventory/stocks', permission: 'inventory:read' },
  { label: 'Movements', to: '/inventory/movements', permission: 'inventory:read' },
  { label: 'Locks', to: '/inventory/locks', permission: 'inventory:read' },
];

export function Sidebar() {
  return (
    <aside
      style={{
        borderRight: '1px solid var(--color-border)',
        padding: 'var(--spacing-xl)',
        width: '240px',
      }}
    >
      <strong>Admin Dashboard</strong>
      <nav
        style={{
          display: 'grid',
          gap: 'var(--spacing-md)',
          marginTop: 'var(--spacing-xl)',
        }}
      >
        {navigationLinks.map((link) => (
          <CanAccess key={link.to} permission={link.permission}>
            <Link to={link.to}>{link.label}</Link>
          </CanAccess>
        ))}
        <CanAccess permission="stores:read">
          <Link to="/stores">Stores</Link>
        </CanAccess>
        <CanAccess permission="catalog:read">
          <NavGroup links={catalogLinks} title="Catalog" />
        </CanAccess>
        <CanAccess permission="locations:read">
          <NavGroup links={locationLinks} title="Locations" />
        </CanAccess>
        <CanAccessAny permissions={['inventory:read', 'store_products:read']}>
          <NavGroup links={inventoryLinks} title="Inventory" />
        </CanAccessAny>
      </nav>
    </aside>
  );
}

function NavGroup({ links, title }: { links: NavLink[]; title: string }) {
  return (
    <div
      style={{
        borderTop: '1px solid var(--color-border)',
        display: 'grid',
        gap: 'var(--spacing-sm)',
        paddingTop: 'var(--spacing-md)',
      }}
    >
      <strong>{title}</strong>
      {links.map((link) => (
        <CanAccess key={link.to} permission={link.permission}>
          <Link style={{ paddingLeft: 'var(--spacing-sm)' }} to={link.to}>
            {link.label}
          </Link>
        </CanAccess>
      ))}
    </div>
  );
}
