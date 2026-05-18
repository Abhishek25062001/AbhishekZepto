import { Link } from 'react-router-dom';

import { Card } from '../../components/common';

export function SettingsPage() {
  return (
    <>
      <h1>Settings</h1>
      <Card description="Vendor account and security settings." title="Settings">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Manage vendor workspace preferences and security controls.
        </p>
        <p>
          <Link to="/settings/sessions">Open sessions</Link>
        </p>
      </Card>
    </>
  );
}
