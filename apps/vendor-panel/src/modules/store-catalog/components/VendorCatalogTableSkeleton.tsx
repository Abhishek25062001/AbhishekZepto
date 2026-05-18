import { Loader } from '../../../components/common';

export function VendorCatalogTableSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <div aria-busy="true" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
      <Loader label="Loading…" />
      <div
        style={{
          display: 'grid',
          gap: 'var(--spacing-sm)',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={{
              background: 'var(--color-surface-muted)',
              borderRadius: 'var(--radius-md)',
              height: 40,
            }}
          />
        ))}
      </div>
    </div>
  );
}
