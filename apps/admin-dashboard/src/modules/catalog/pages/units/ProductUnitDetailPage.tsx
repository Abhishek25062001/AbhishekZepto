import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CanAccess } from '../../../../components/auth/CanAccess';
import { Loader } from '../../../../components/common';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { CatalogStatusBadge } from '../../components/CatalogStatusBadge';
import { BASE_UNIT_LABELS } from '../../constants/product-unit.constants';
import { useProductUnitDetail } from '../../hooks/useProductUnitDetail';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';

export function ProductUnitDetailPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const detail = useProductUnitDetail(unitId);
  const record = detail.data;

  if (detail.isLoading || !unitId) {
    return <Loader label="Loading product unit..." mode="page" />;
  }

  if (detail.error || !record) {
    return (
      <CatalogErrorState
        message={mapCatalogErrorCodeToMessage(
          extractApiErrorCode(detail.error),
          'Unable to load this product unit.',
        )}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  return (
    <>
      <header style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h1 style={{ margin: 0 }}>{record.name}</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>
            Review measurement metadata used by catalog products.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <Link to="/catalog/units">Back to list</Link>
          <CanAccess permission="catalog:update">
            <Link to={`/catalog/units/${record.id}/edit`}>Edit</Link>
          </CanAccess>
        </div>
      </header>
      <section style={{ display: 'grid', gap: 'var(--spacing-md)', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <DetailCard title="Unit">
          <DetailRow label="Code" value={record.code} />
          <DetailRow label="Base unit" value={BASE_UNIT_LABELS[record.baseUnit]} />
          <DetailRow label="Conversion factor" value={record.conversionFactor} />
          <DetailRow label="Catalog status" value={<CatalogStatusBadge status={record.status} />} />
        </DetailCard>
        <DetailCard title="Timestamps">
          <DetailRow label="Created" value={new Date(record.createdAt).toLocaleString()} />
          <DetailRow label="Updated" value={new Date(record.updatedAt).toLocaleString()} />
        </DetailCard>
      </section>
    </>
  );
}

type DetailCardProps = {
  children: ReactNode;
  title: string;
};

function DetailCard({ children, title }: DetailCardProps) {
  return (
    <article style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'grid', gap: 'var(--spacing-sm)', padding: 'var(--spacing-lg)' }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      {children}
    </article>
  );
}

type DetailRowProps = {
  label: string;
  value: ReactNode;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div>
      <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}
