import { Link } from 'react-router-dom';
import type { PermissionCode } from '../../../../../packages/shared/api';
import { CanAccess } from '../auth/CanAccess';

const navigationLinks: Array<{ label: string; to: string; permission: PermissionCode }> = [
  { label: 'Dashboard', to: '/dashboard', permission: 'vendor:read_store' },
  { label: 'Incoming Orders', to: '/orders', permission: 'orders:read' },
  { label: 'Active Orders', to: '/orders/active', permission: 'orders:read' },
  { label: 'Order History', to: '/orders/history', permission: 'orders:read' },
  { label: 'Store Catalog', to: '/store-catalog/products', permission: 'catalog:read' },
  { label: 'Store Products', to: '/store-products', permission: 'store_products:read' },
  { label: 'Inventory', to: '/inventory/stocks', permission: 'inventory:read' },
  { label: 'Media', to: '/media', permission: 'catalog:read' },
  { label: 'Settings', to: '/settings', permission: 'settings:manage' },
];

export function Sidebar() {
  return (
    <aside
      style={{
        borderRight: '1px solid var(--color-border)',
        padding: 'var(--spacing-xl)',
        width: '220px',
      }}
    >
      <strong>Vendor Panel</strong>
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
      </nav>
    </aside>
  );
}
