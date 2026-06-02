import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CanAccess } from '../../../../components/auth/CanAccess';
import { Loader } from '../../../../components/common';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { CatalogStatusBadge } from '../../components/CatalogStatusBadge';
import { useBrandDetail } from '../../hooks/useBrandDetail';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';

export function BrandDetailPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const detail = useBrandDetail(brandId);
  const record = detail.data;

  if (detail.isLoading || !brandId) {
    return <Loader label="Loading brand..." mode="page" />;
  }

  if (detail.error || !record) {
    return (
      <CatalogErrorState
        message={mapCatalogErrorCodeToMessage(
          extractApiErrorCode(detail.error),
          'Unable to load this brand.',
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
            Review brand visibility and merchandising flags.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <Link to="/catalog/brands">Back to list</Link>
          <CanAccess permission="catalog:update">
            <Link to={`/catalog/brands/${record.id}/edit`}>Edit</Link>
          </CanAccess>
        </div>
      </header>
      <section style={{ display: 'grid', gap: 'var(--spacing-md)', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <DetailCard title="Identity">
          <DetailRow label="Slug" value={record.slug} />
          <DetailRow label="Catalog status" value={<CatalogStatusBadge status={record.status} />} />
          <DetailRow label="Visible" value={record.isVisible ? 'Yes' : 'No'} />
          <DetailRow label="Featured" value={record.isFeatured ? 'Yes' : 'No'} />
        </DetailCard>
        <DetailCard title="Content">
          <DetailRow label="Description" value={record.description ?? 'No description'} />
          <DetailRow label="Logo URL" value={record.logoUrl ?? 'None'} />
          <DetailRow label="Banner URL" value={record.bannerUrl ?? 'None'} />
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
