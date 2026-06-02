import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CanAccess } from '../../../../components/auth/CanAccess';
import { Loader } from '../../../../components/common';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { CatalogStatusBadge } from '../../components/CatalogStatusBadge';
import { useCategoryDetail } from '../../hooks/useCategoryDetail';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';

export function CategoryDetailPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const detail = useCategoryDetail(categoryId);
  const record = detail.data;

  if (detail.isLoading || !categoryId) {
    return <Loader label="Loading category..." mode="page" />;
  }

  if (detail.error || !record) {
    return (
      <CatalogErrorState
        message={mapCatalogErrorCodeToMessage(
          extractApiErrorCode(detail.error),
          'Unable to load this category.',
        )}
        onRetry={() => void detail.refetch()}
      />
    );
  }

  return (
    <>
      <header
        style={{
          alignItems: 'flex-start',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-lg)',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>{record.name}</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>
            Review category visibility, hierarchy, and merchandising flags.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <Link to="/catalog/categories">Back to list</Link>
          <CanAccess permission="catalog:update">
            <Link to={`/catalog/categories/${record.id}/edit`}>Edit</Link>
          </CanAccess>
        </div>
      </header>
      <section
        style={{
          display: 'grid',
          gap: 'var(--spacing-md)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        <DetailCard title="Identity">
          <DetailRow label="Slug" value={record.slug} />
          <DetailRow label="Catalog status" value={<CatalogStatusBadge status={record.status} />} />
          <DetailRow label="Parent category ID" value={record.parentCategoryId ?? 'None'} />
          <DetailRow label="Level" value={record.level} />
          <DetailRow label="Display order" value={record.displayOrder} />
        </DetailCard>
        <DetailCard title="Visibility">
          <DetailRow label="Visible" value={record.isVisible ? 'Yes' : 'No'} />
          <DetailRow label="Featured" value={record.isFeatured ? 'Yes' : 'No'} />
          <DetailRow label="Created" value={new Date(record.createdAt).toLocaleString()} />
          <DetailRow label="Updated" value={new Date(record.updatedAt).toLocaleString()} />
        </DetailCard>
        <DetailCard title="Content">
          <DetailRow label="Description" value={record.description ?? 'No description'} />
          <DetailRow label="Icon URL" value={record.iconUrl ?? 'None'} />
          <DetailRow label="Banner URL" value={record.bannerUrl ?? 'None'} />
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
    <article
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        display: 'grid',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-lg)',
      }}
    >
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
