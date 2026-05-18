export function CatalogTableSkeleton({ columns = 4, rows = 6 }: { columns?: number; rows?: number }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th
              key={`head-${String(index)}`}
              style={{
                borderBottom: '1px solid var(--color-border)',
                padding: 'var(--spacing-sm) 0',
              }}
            >
              <span
                style={{
                  background: 'var(--color-background)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'block',
                  height: 10,
                }}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={`row-${String(rowIndex)}`}>
            {Array.from({ length: columns }).map((__, colIndex) => (
              <td
                key={`cell-${String(rowIndex)}-${String(colIndex)}`}
                style={{ borderBottom: '1px solid var(--color-border)', padding: 'var(--spacing-sm) 0' }}
              >
                <span
                  style={{
                    background: 'var(--color-background)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'block',
                    height: 14,
                  }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
