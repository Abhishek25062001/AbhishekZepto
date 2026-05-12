import { Link } from 'react-router-dom';

const navigationLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Orders', to: '/orders' },
  { label: 'Inventory', to: '/inventory' },
  { label: 'Products', to: '/products' },
  { label: 'Settings', to: '/settings' },
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
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
