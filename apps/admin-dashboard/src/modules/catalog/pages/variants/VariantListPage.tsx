import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CanAccess } from '../../../../components/auth/CanAccess';
import { Button, Loader, Table, type TableColumn } from '../../../../components/common';
import { getAdminProductVariants } from '../../api/product.api';
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog';
import { CatalogErrorState } from '../../components/CatalogErrorState';
import { CatalogStatusBadge } from '../../components/CatalogStatusBadge';
import {
  buildProductVariantFormDefaults,
  ProductVariantForm,
} from '../../forms/ProductVariantForm';
import { useProductDetail } from '../../hooks/useProductDetail';
import { useProductVariantMutations } from '../../hooks/useProductVariantMutations';
import type { ProductVariantResponse } from '../../types/product-variant.types';

export function VariantListPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = useProductDetail(productId);
  const mutations = useProductVariantMutations(productId ?? '');
  const [variants, setVariants] = useState<ProductVariantResponse[]>([]);
  const [editingVariant, setEditingVariant] = useState<ProductVariantResponse | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ProductVariantResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const reloadVariants = () => {
    if (!productId) {
      return;
    }

    setLoading(true);
    setError(null);
    void getAdminProductVariants(productId, { limit: 500 })
      .then(setVariants)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reloadVariants();
  }, [productId]);

  const columns: TableColumn<ProductVariantResponse>[] = [
    { header: 'SKU', key: 'sku' },
    {
      header: 'Name',
      key: 'variantName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.variantName}</div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
            {row.unitValue} {row.unit}
          </div>
        </div>
      ),
    },
    { header: 'MRP', key: 'mrp' },
    {
      header: 'Visible',
      key: 'isVisible',
      render: (row) => (row.isVisible ? 'Yes' : 'No'),
    },
    {
      header: 'Default',
      key: 'isDefault',
      render: (row) => (row.isDefault ? 'Yes' : 'No'),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <CatalogStatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      key: 'id',
      render: (row) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <CanAccess permission="catalog:update">
            <Button size="sm" type="button" variant="outline" onClick={() => setEditingVariant(row)}>
              Edit
            </Button>
          </CanAccess>
          <CanAccess permission="catalog:delete">
            <Button size="sm" type="button" variant="danger" onClick={() => setPendingDelete(row)}>
              Delete
            </Button>
          </CanAccess>
        </div>
      ),
    },
  ];

  if (product.isLoading || loading) {
    return <Loader label="Loading variants…" mode="page" />;
  }

  if (error || !productId) {
    return (
      <CatalogErrorState
        message="Unable to load product variants."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{ margin: 0 }}>Variants — {product.data?.name ?? productId}</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
          <Link to={`/catalog/products/${productId}`}>Back to product</Link>
          <CanAccess permission="catalog:create">
            <Button size="sm" type="button" variant="primary" onClick={() => setCreating(true)}>
              Create variant
            </Button>
          </CanAccess>
        </div>
      </header>
      {creating ? (
        <section style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-lg)' }}>
          <h2 style={{ marginTop: 0 }}>Create variant</h2>
          <ProductVariantForm
            loading={mutations.createMutation.isPending}
            submitLabel="Create variant"
            onCancel={() => setCreating(false)}
            onSubmit={async (values) => {
              await mutations.createMutation.mutateAsync(values);
              setCreating(false);
              reloadVariants();
            }}
          />
        </section>
      ) : null}
      {editingVariant ? (
        <section style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-lg)' }}>
          <h2 style={{ marginTop: 0 }}>Edit variant</h2>
          <ProductVariantForm
            defaultValues={buildProductVariantFormDefaults(editingVariant)}
            loading={mutations.updateMutation.isPending}
            submitLabel="Save variant"
            onCancel={() => setEditingVariant(null)}
            onSubmit={async (values) => {
              await mutations.updateMutation.mutateAsync({
                payload: values,
                variantId: editingVariant.id,
              });
              setEditingVariant(null);
              reloadVariants();
            }}
          />
        </section>
      ) : null}
      <Table columns={columns} data={variants} emptyMessage="No variants for this product." rowKey="id" />
      <ConfirmDeleteDialog
        loading={mutations.deleteMutation.isPending}
        open={Boolean(pendingDelete)}
        title="Delete this variant?"
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) {
            return;
          }
          void mutations.deleteMutation.mutateAsync(pendingDelete.id).then(() => {
            setPendingDelete(null);
            reloadVariants();
          });
        }}
      />
    </div>
  );
}
