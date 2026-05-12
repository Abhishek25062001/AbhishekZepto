import { Link } from 'react-router-dom';

const navigationLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Users', to: '/users' },
  { label: 'Stores', to: '/stores' },
  { label: 'Products', to: '/products' },
  { label: 'Orders', to: '/orders' },
  { label: 'Delivery Agents', to: '/delivery-agents' },
  { label: 'Finance', to: '/finance' },
  { label: 'Support', to: '/support' },
  { label: 'Settings', to: '/settings' },
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
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
