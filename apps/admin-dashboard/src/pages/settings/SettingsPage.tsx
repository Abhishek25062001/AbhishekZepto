import { Link } from 'react-router-dom';

import { Card } from '../../components/common';

export function SettingsPage() {
  return (
    <>
      <h1>Settings</h1>
      <Card description="Admin account and security settings." title="Settings">
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Manage admin workspace preferences and security controls.
        </p>
        <p>
          <Link to="/settings/sessions">Open sessions</Link>
        </p>
        <p>
          <Link to="/settings/platform">Open platform settings</Link>
        </p>
      </Card>
    </>
  );
}
