import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { CanAccess } from '../../../components/auth/CanAccess';
import { Table, type TableColumn } from '../../../components/common';
import { VendorAvailabilityBadge, VendorCatalogStatusBadge } from '../components/VendorCatalogStatusBadge';
import { VendorCatalogEmptyState } from '../components/VendorCatalogEmptyState';
import { VendorCatalogErrorState } from '../components/VendorCatalogErrorState';
import { VendorCatalogPagination } from '../components/VendorCatalogPagination';
import { VendorCatalogSearchInput } from '../components/VendorCatalogSearchInput';
import { VendorCatalogTableSkeleton } from '../components/VendorCatalogTableSkeleton';
import { useVendorStoreProducts } from '../hooks/useVendorStoreProducts';
import type { VendorStoreProduct } from '../types/vendor-store-product.types';
import {
  extractApiErrorCode,
  mapStoreProductErrorCodeToMessage,
} from '../utils/vendor-catalog-error-message.util';

type Row = VendorStoreProduct & Record<string, unknown>;

export function VendorStoreProductListPage() {
  const { data, error, isLoading, refetch, isFetching } = useVendorStoreProducts();
  const rows = useMemo(() => (data?.items ?? []).map((item) => ({ ...item } as Row)), [data?.items]);

  const columns: TableColumn<Row>[] = [
    { header: 'SKU', key: 'sku' },
    { header: 'Product', key: 'productId' },
    { header: 'Variant', key: 'variantId' },
    { header: 'MRP', key: 'mrp' },
    { header: 'Selling', key: 'sellingPrice' },
    { header: 'Final', key: 'finalPrice' },
    {
      header: 'Available',
      key: 'isAvailable',
      render: (row) => <VendorAvailabilityBadge isAvailable={row.isAvailable} />,
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <VendorCatalogStatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      key: 'id',
      render: (row) => <StoreProductRowActions storeProductId={row.id} />,
    },
  ];

  if (error) {
    return (
      <VendorCatalogErrorState
        message={mapStoreProductErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load store products.')}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <header>
        <h1>Store products</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage store-scoped pricing and availability.</p>
      </header>
      <VendorCatalogSearchInput placeholder="Search store products" />
      {isLoading && !data ? <VendorCatalogTableSkeleton columns={columns.length} /> : null}
      {!isLoading && rows.length === 0 ? (
        <VendorCatalogEmptyState title="No store products" />
      ) : null}
      {rows.length > 0 ? (
        <Table columns={columns} data={rows} loading={isFetching && Boolean(data)} rowKey="id" />
      ) : null}
      <VendorCatalogPagination pagination={data?.pagination} />
    </section>
  );
}

function StoreProductRowActions({ storeProductId }: { storeProductId: string }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
      <Link to={`/store-products/${storeProductId}`}>View</Link>
      <CanAccess permission="store_products:update">
        <Link to={`/store-products/${storeProductId}/price`}>Price</Link>
        <Link to={`/store-products/${storeProductId}/availability`}>Availability</Link>
      </CanAccess>
    </div>
  );
}
