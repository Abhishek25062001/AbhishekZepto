import { useState } from 'react';

import { Button } from '../../../components/common';
import type { BulkStoreProductMapPayload, BulkOperationSummary } from '../types/store-product.types';

type Props = {
  loading?: boolean;
  onSubmit: (payload: BulkStoreProductMapPayload) => Promise<BulkOperationSummary | void>;
};

const example = `[
  {
    "storeId": "store-id",
    "productId": "product-id",
    "variantId": "variant-id",
    "mrp": 100,
    "sellingPrice": 90
  }
]`;

export function BulkStoreProductMapForm({ loading = false, onSubmit }: Props) {
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
          const items = JSON.parse(json) as BulkStoreProductMapPayload['items'];
          if (!Array.isArray(items) || items.length === 0) {
            setError('Provide a non-empty JSON array of mapping items.');
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
        Items JSON
        <textarea
          placeholder={example}
          rows={10}
          value={json}
          onChange={(event) => setJson(event.target.value)}
          style={{ borderRadius: 'var(--radius-md)', fontFamily: 'monospace', padding: 'var(--spacing-md)' }}
        />
      </label>
      {error ? <span style={{ color: 'var(--color-error)' }}>{error}</span> : null}
      {summary ? (
        <p style={{ margin: 0 }}>
          Created {summary.created ?? 0}, skipped {summary.skipped ?? 0}, failed {summary.failed ?? 0}
        </p>
      ) : null}
      <Button loading={loading} type="submit" variant="primary">
        Bulk map products
      </Button>
    </form>
  );
}
