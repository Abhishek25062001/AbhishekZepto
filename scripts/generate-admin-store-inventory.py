#!/usr/bin/env python3
"""Generate admin-dashboard store & inventory module pages and routes."""
from __future__ import annotations

import os

ROOT = os.path.join(
    os.path.dirname(__file__),
    "..",
    "apps",
    "admin-dashboard",
    "src",
)


def w(rel: str, content: str) -> None:
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


CREATE_EDIT = '''import {{ useNavigate, useParams }} from 'react-router-dom';
import {{ Loader }} from '{common}';
import {{ CatalogPageHeader }} from '{catalog}/CatalogPageHeader';
import {{ CatalogErrorState }} from '{catalog}/CatalogErrorState';
import {{ {form} }} from '{formpath}';
import {{ use{entity}Detail }} from '{hookpath}/use{entity}Detail';
import {{ use{entity}Mutations }} from '{hookpath}/use{entity}Mutations';
import {{ extractApiErrorCode, map{err}ErrorCodeToMessage }} from '{errutil}';

export function {page}() {{
  const navigate = useNavigate();
  const {{ {param} }} = useParams<{{ {param}: string }}>();
  const isEdit = {is_edit};
  const detail = use{entity}Detail(isEdit ? {param} : undefined);
  const {{ {create_or_update}Mutation }} = use{entity}Mutations();

  if (isEdit && (detail.isLoading || !{param})) return <Loader label="Loading…" mode="page" />;
  if (isEdit && (detail.error || !detail.data)) {{
    return (
      <CatalogErrorState
        message={{map{err}ErrorCodeToMessage(extractApiErrorCode(detail.error), 'Unable to load.')}}
        onRetry={{() => void detail.refetch()}}
      />
    );
  }}

  return (
    <>
      <CatalogPageHeader title="{title}" description="{desc}" requiredPermission="{perm}" />
      <{form}
        defaultValues={{isEdit ? detail.data : undefined}}
        submitLabel={{{create_or_update}Mutation.isPending ? 'Saving…' : '{submit}'}}
        onSubmit={{async (values) => {{
          try {{
            if (isEdit && {param}) {{
              await {create_or_update}Mutation.mutateAsync({{ {param_key}: {param}, payload: values }});
            }} else {{
              await {create_or_update}Mutation.mutateAsync(values);
            }}
            navigate('{list}');
          }} catch (error) {{
            alert(map{err}ErrorCodeToMessage(extractApiErrorCode(error), 'Unable to save.'));
          }}
        }}}}
      />
    </>
  );
}}
'''

# City pages
w(
    "modules/stores/pages/cities/CityListPage.tsx",
    '''import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CanAccess } from '../../../../components/auth/CanAccess';
import { Button, Table, type TableColumn } from '../../../../components/common';
import { CatalogEmptyState } from '../../../catalog/components/CatalogEmptyState';
import { CatalogErrorState } from '../../../catalog/components/CatalogErrorState';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { CatalogPagination } from '../../../catalog/components/CatalogPagination';
import { CatalogSearchInput } from '../../../catalog/components/CatalogSearchInput';
import { CatalogTableSkeleton } from '../../../catalog/components/CatalogTableSkeleton';
import { ConfirmDeleteDialog } from '../../../catalog/components/ConfirmDeleteDialog';
import { LocationStatusBadge } from '../../components/StoreStatusBadge';
import { LOCATION_STATUS, LOCATION_STATUS_LABELS } from '../../constants/store.constants';
import { useCities } from '../../hooks/useCities';
import { useCityMutations } from '../../hooks/useCityMutations';
import type { CityResponse } from '../../types/city.types';
import { DELETE_CONFIRMATION, extractApiErrorCode, mapStoreErrorCodeToMessage } from '../../utils/store-error-message.util';
import { setSearchParams } from '../../utils/store-query-param.util';

type Row = CityResponse & Record<string, unknown>;

export function CityListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useCities();
  const { deleteMutation } = useCityMutations();
  const [pendingDelete, setPendingDelete] = useState<CityResponse | null>(null);
  const rows = useMemo(() => (data?.items ?? []).map((i) => ({ ...i } as Row)), [data?.items]);
  const columns: TableColumn<Row>[] = [
    { header: 'Name', key: 'name' },
    { header: 'State', key: 'state' },
    { header: 'Serviceable', key: 'isServiceable', render: (r) => (r.isServiceable ? 'Yes' : 'No') },
    { header: 'Status', key: 'status', render: (r) => <LocationStatusBadge status={r.status} /> },
    {
      header: 'Actions',
      key: 'id',
      render: (r) => (
        <motionlessActions>
          <Link to={`/locations/cities/${r.id}/edit`}>Edit</Link>
          <CanAccess permission="locations:delete">
            <Button size="sm" type="button" variant="danger" onClick={() => setPendingDelete(r)}>Delete</Button>
          </CanAccess>
        </motionlessActions>
      ),
    },
  ];
  if (error) {
    return (
      <>
        <CatalogPageHeader title="Cities" description="Manage serviceable cities." primaryActionHref="/locations/cities/new" primaryActionLabel="Create city" requiredPermission="locations:create" />
        <CatalogErrorState message={mapStoreErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load cities.')} onRetry={() => void refetch()} />
      </>
    );
  }
  return (
    <>
      <CatalogPageHeader title="Cities" description="Manage serviceable cities." primaryActionHref="/locations/cities/new" primaryActionLabel="Create city" requiredPermission="locations:create" />
      <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <CatalogSearchInput />
        <FilterSelect label="Status" value={searchParams.get('status') ?? ''} options={[{ label: 'All', value: '' }, ...Object.values(LOCATION_STATUS).map((s) => ({ label: LOCATION_STATUS_LABELS[s], value: s }))]} onChange={(v) => { const p = new URLSearchParams(searchParams); setSearchParams(p, { page: 1, status: v || null }); setUrlSearchParams(p, { replace: true }); }} />
        {isLoading && !data ? <CatalogTableSkeleton columns={5} /> : null}
        {!isLoading && rows.length === 0 ? <CatalogEmptyState description="No cities match your filters." title="No cities" /> : null}
        {rows.length > 0 ? <Table columns={columns} data={rows} rowKey="id" loading={isFetching && Boolean(data)} /> : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
      <ConfirmDeleteDialog open={Boolean(pendingDelete)} title={DELETE_CONFIRMATION.city} loading={deleteMutation.isPending} onClose={() => setPendingDelete(null)} onConfirm={() => pendingDelete && void deleteMutation.mutateAsync(pendingDelete.id).then(() => setPendingDelete(null))} />
    </>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: { label: string; value: string }[]; onChange: (v: string) => void }) {
  const id = label.toLowerCase().replace(/\\s+/g, '-');
  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} style={{ borderRadius: 'var(--radius-md)', minWidth: 200, padding: 'var(--spacing-md)' }}>
        {options.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function motionlessActions({ children }: { children: React.ReactNode }) {
  return <motionlessActionsInner>{children}</motionlessActionsInner>;
}

function motionlessActionsInner({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>{children}</motionlessActionsInner>;
}
''',
)

print("Generated city list - fix motionlessActions in post-process")
print("Script incomplete - run manual fixes")
