import { useState } from 'react';

import { Button } from '../../../components/common';
import type { BulkInventoryUploadPayload, BulkOperationSummary } from '../types/inventory-stock.types';

type Props = {
  loading?: boolean;
  onSubmit: (payload: BulkInventoryUploadPayload) => Promise<BulkOperationSummary | void>;
};

export function BulkInventoryUploadForm({ loading = false, onSubmit }: Props) {
  const [json, setJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<BulkOperationSummary | null>(null);

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-md)' }}
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        setSummary(null);
        try {
          const items = JSON.parse(json) as BulkInventoryUploadPayload['items'];
          if (!Array.isArray(items) || items.length === 0) {
            setError('Provide a non-empty JSON array of stock rows.');
            return;
          }
          void onSubmit({ items }).then((result) => {
            if (result) {
              setSummary(result);
            }
          });
        } catch {
          setError('Invalid JSON payload.');
        }
      }}
    >
      <label style={{ display: 'grid', gap: '6px' }}>
        Stock upload JSON
        <textarea
          placeholder='[{ "storeProductId": "id", "availableQuantity": 50 }]'
          rows={8}
          value={json}
          onChange={(event) => setJson(event.target.value)}
          style={{ borderRadius: 'var(--radius-md)', fontFamily: 'monospace', padding: 'var(--spacing-md)' }}
        />
      </label>
      {error ? <span style={{ color: 'var(--color-error)' }}>{error}</span> : null}
      {summary ? (
        <p style={{ margin: 0 }}>
          Created {summary.created ?? 0}, updated {summary.updated ?? 0}, failed {summary.failed ?? 0}
        </p>
      ) : null}
      <Button loading={loading} type="submit" variant="primary">
        Bulk upload stock
      </Button>
    </form>
  );
}
