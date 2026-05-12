export function Header() {
  return (
    <header
      style={{
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        padding: 'var(--spacing-lg) var(--spacing-xl)',
      }}
    >
      <span>Admin workspace</span>
      <button type="button">Admin user menu</button>
    </header>
  );
}
