import { useState } from 'react';

import { Button } from '../../../components/common';
import type { BulkOperationSummary, BulkStoreProductPricePayload } from '../types/store-product.types';

type Props = {
  loading?: boolean;
  onSubmit: (payload: BulkStoreProductPricePayload) => Promise<BulkOperationSummary | void>;
};

export function BulkStoreProductPriceForm({ loading = false, onSubmit }: Props) {
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
          const items = JSON.parse(json) as BulkStoreProductPricePayload['items'];
          if (!Array.isArray(items) || items.length === 0) {
            setError('Provide a non-empty JSON array of price updates.');
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
        Price updates JSON
        <textarea
          placeholder='[{ "storeProductId": "id", "sellingPrice": 99 }]'
          rows={8}
          value={json}
          onChange={(event) => setJson(event.target.value)}
          style={{ borderRadius: 'var(--radius-md)', fontFamily: 'monospace', padding: 'var(--spacing-md)' }}
        />
      </label>
      {error ? <span style={{ color: 'var(--color-error)' }}>{error}</span> : null}
      {summary ? (
        <p style={{ margin: 0 }}>
          Updated {summary.updated ?? 0}, skipped {summary.skipped ?? 0}, failed {summary.failed ?? 0}
        </p>
      ) : null}
      <Button loading={loading} type="submit" variant="primary">
        Bulk update prices
      </Button>
    </form>
  );
}
