import { Card } from '../../../components/common';

type AuditLogStatePanelProps = {
  state: Record<string, unknown>;
  title: string;
};

export function AuditLogStatePanel({ state, title }: AuditLogStatePanelProps) {
  return (
    <Card title={title}>
      <pre
        style={{
          background: 'var(--color-background)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          margin: 0,
          maxHeight: 360,
          overflow: 'auto',
          padding: 'var(--spacing-md)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {JSON.stringify(state, null, 2)}
      </pre>
    </Card>
  );
}
