import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '../../../components/common';
import type { ApiPaginationMeta } from '../../../types/api.types';
import { parseNumberParam, setSearchParams } from '../utils/vendor-catalog-query-param.util';

type Props = {
  pagination?: ApiPaginationMeta;
};

export function VendorCatalogPagination({ pagination }: Props) {
  const [searchParams, setUrlSearchParams] = useSearchParams();

  const applyPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      setSearchParams(params, { page });
      setUrlSearchParams(params, { replace: true });
    },
    [searchParams, setUrlSearchParams],
  );

  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const currentLimit = parseNumberParam(searchParams.get('limit'), pagination.limit ?? 20);

  return (
    <footer
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-md)',
        justifyContent: 'space-between',
        marginTop: 'var(--spacing-xl)',
      }}
    >
      <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
        Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
      </p>
      <PaginationControls
        applyPage={applyPage}
        currentLimit={currentLimit}
        pagination={pagination}
        searchParams={searchParams}
        setUrlSearchParams={setUrlSearchParams}
      />
    </footer>
  );
}

function PaginationControls({
  applyPage,
  currentLimit,
  pagination,
  searchParams,
  setUrlSearchParams,
}: {
  applyPage: (page: number) => void;
  currentLimit: number;
  pagination: ApiPaginationMeta;
  searchParams: URLSearchParams;
  setUrlSearchParams: ReturnType<typeof useSearchParams>[1];
}) {
  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
      <Button
        disabled={!pagination.hasPreviousPage}
        type="button"
        variant="outline"
        onClick={() => applyPage(pagination.page - 1)}
      >
        Previous
      </Button>
      <Button
        disabled={!pagination.hasNextPage}
        type="button"
        variant="outline"
        onClick={() => applyPage(pagination.page + 1)}
      >
        Next
      </Button>
      <label
        htmlFor="vendor-catalog-page-size"
        style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}
      >
        <span style={{ color: 'var(--color-text-secondary)' }}>Per page</span>
        <select
          id="vendor-catalog-page-size"
          value={currentLimit}
          onChange={(event) => {
            const params = new URLSearchParams(searchParams);
            setSearchParams(params, { limit: Number(event.target.value), page: 1 });
            setUrlSearchParams(params, { replace: true });
          }}
          style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-sm)' }}
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
