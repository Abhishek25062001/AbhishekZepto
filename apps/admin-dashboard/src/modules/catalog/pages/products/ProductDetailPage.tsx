import { useMemo, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Badge, Button, Loader } from '../../../../components/common';
import { CanAccess } from '../../../../components/auth/CanAccess';
import { PRODUCT_APPROVAL_STATUS_LABELS } from '../../constants/product.constants';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { CatalogStatusBadge } from '../../components/CatalogStatusBadge';
import { ProductApprovalDialog } from '../../components/ProductApprovalDialog';
import { useProductDetail } from '../../hooks/useProductDetail';
import { useProductMutations } from '../../hooks/useProductMutations';
import {
  extractApiErrorCode,
  mapCatalogErrorCodeToMessage,
} from '../../utils/catalog-error-message.util';

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const detail = useProductDetail(productId);
  const { approvalMutation } = useProductMutations();
  const [approvalOpen, setApprovalOpen] = useState(false);

  const record = detail.data;

  const keywords = useMemo(() => record?.searchKeywords?.join(', ') ?? '—', [record?.searchKeywords]);
  const tags = useMemo(() => record?.tags?.join(', ') ?? '—', [record?.tags]);

  if (detail.isLoading || !productId) {
    return <Loader label="Loading product…" mode="page" />;
  }

  if (detail.error || !record) {
    return (
      <CatalogErrorState
        message={mapCatalogErrorCodeToMessage(
          extractApiErrorCode(detail.error),
          'Unable to load this product.',
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
            Review merchandising metadata, structured data, and approval state.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <Link to="/catalog/products">Back to list</Link>
          <CanAccess permission="catalog:read">
            <Link to={`/catalog/products/${record.id}/variants`}>Variants</Link>
          </CanAccess>
          <CanAccess permission="catalog:update">
            <Link to={`/catalog/products/${record.id}/edit`}>Edit</Link>
          </CanAccess>
          <CanAccess permission="catalog:approve">
            <Button type="button" variant="outline" onClick={() => setApprovalOpen(true)}>
              Update approval
            </Button>
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
        <DetailCard title="Commercial">
          <DetailRow label="Slug" value={record.slug} />
          <DetailRow
            label="Approval"
            value={<Badge variant="neutral">{PRODUCT_APPROVAL_STATUS_LABELS[record.approvalStatus]}</Badge>}
          />
          <DetailRow label="Catalog status" value={<CatalogStatusBadge status={record.status} />} />
          <DetailRow label="Featured" value={record.isFeatured ? 'Yes' : 'No'} />
          <DetailRow label="Visible" value={record.isVisible ? 'Yes' : 'No'} />
        </DetailCard>
        <DetailCard title="Taxonomy">
          <DetailRow label="Category ID" value={record.categoryId} />
          <DetailRow label="Subcategory ID" value={record.subcategoryId ?? '—'} />
          <DetailRow label="Brand ID" value={record.brandId ?? '—'} />
        </DetailCard>
        <DetailCard title="Classification">
          <DetailRow label="Product type" value={record.productType} />
          <DetailRow label="Food type" value={record.foodType ?? '—'} />
          <DetailRow label="Tax category" value={record.taxCategoryId ?? '—'} />
          <DetailRow label="HSN code" value={record.hsnCode ?? '—'} />
        </DetailCard>
        <DetailCard title="Content">
          <DetailRow label="Short description" value={record.shortDescription ?? '—'} />
          <p style={{ margin: 0 }}>{record.description ?? 'No long description.'}</p>
          <DetailRow label="Keywords" value={keywords} />
          <DetailRow label="Tags" value={tags} />
        </DetailCard>
      </section>
      {record.defaultImageUrl ? (
        <figure style={{ marginTop: 'var(--spacing-xl)' }}>
          <figcaption style={{ fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Default image</figcaption>
          <img
            alt={record.name}
            src={record.defaultImageUrl}
            style={{ borderRadius: 'var(--radius-md)', maxHeight: 320, maxWidth: '100%' }}
          />
        </figure>
      ) : null}
      <ProductApprovalDialog
        key={record.id}
        loading={approvalMutation.isPending}
        open={approvalOpen}
        productName={record.name}
        onClose={() => setApprovalOpen(false)}
        onSubmit={async (values) => {
          await approvalMutation.mutateAsync({
            payload: {
              approvalStatus: values.approvalStatus,
              rejectionReason: values.rejectionReason,
            },
            productId: record.id,
          });
          setApprovalOpen(false);
        }}
      />
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
