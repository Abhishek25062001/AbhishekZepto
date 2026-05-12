import type { ReactNode } from 'react';

export type TableColumn<TData extends Record<string, unknown>> = {
  header: string;
  key: Extract<keyof TData, string>;
  render?: (row: TData) => ReactNode;
};

type TableProps<TData extends Record<string, unknown>> = {
  columns: TableColumn<TData>[];
  data: TData[];
  emptyMessage?: string;
  loading?: boolean;
  rowKey?: Extract<keyof TData, string> | ((row: TData, index: number) => string);
};

export function Table<TData extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = 'No records found.',
  loading = false,
  rowKey,
}: TableProps<TData>) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              style={{
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                padding: 'var(--spacing-sm) 0',
                textAlign: 'left',
              }}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns.length} style={{ padding: 'var(--spacing-md) 0' }}>
              Loading...
            </td>
          </tr>
        ) : null}
        {!loading && data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ padding: 'var(--spacing-md) 0' }}>
              {emptyMessage}
            </td>
          </tr>
        ) : null}
        {!loading
          ? data.map((row, rowIndex) => (
              <tr key={getRowKey(row, rowIndex, rowKey)}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{ borderBottom: '1px solid var(--color-border)', padding: 'var(--spacing-sm) 0' }}
                  >
                    {column.render ? column.render(row) : String(row[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          : null}
      </tbody>
    </table>
  );
}

function getRowKey<TData extends Record<string, unknown>>(
  row: TData,
  index: number,
  rowKey?: Extract<keyof TData, string> | ((row: TData, index: number) => string),
) {
  if (typeof rowKey === 'function') {
    return rowKey(row, index);
  }

  if (rowKey) {
    return String(row[rowKey]);
  }

  return String(index);
}
