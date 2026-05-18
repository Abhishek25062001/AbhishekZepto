import { useQuery } from '@tanstack/react-query';

import { getAdminCategories } from '../api/category.api';
import type { CategoryResponse } from '../types/category.types';

function buildLabel(category: CategoryResponse) {
  const prefix = category.level > 1 ? '— ' : '';
  return `${prefix}${category.name}`;
}

type CategorySelectProps = {
  disabled?: boolean;
  error?: string;
  excludeIds?: string[];
  id?: string;
  label?: string;
  onlyChildOf?: string | null;
  onlyRoots?: boolean;
  value?: string | null;
  onChange: (nextId: string | undefined) => void;
};

export function CategorySelect({
  disabled = false,
  error,
  excludeIds,
  id,
  label = 'Category',
  onlyChildOf,
  onlyRoots = false,
  value,
  onChange,
}: CategorySelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-category-options'],
    queryFn: () =>
      getAdminCategories({
        limit: 500,
        sortBy: 'name',
        sortOrder: 'asc',
      }),
  });

  const parentFilter =
    onlyChildOf && onlyChildOf.trim() !== '' ? onlyChildOf : null;

  const items = (data?.items ?? []).filter((category) => {
    if (excludeIds?.includes(category.id)) {
      return false;
    }
    if (onlyRoots && category.parentCategoryId) {
      return false;
    }
    if (parentFilter && category.parentCategoryId !== parentFilter) {
      return false;
    }
    return true;
  });

  const errorId = error ? `${id ?? 'category-select'}-error` : undefined;

  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      <select
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
        disabled={disabled || isLoading}
        id={id}
        value={value ?? ''}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next ? next : undefined);
        }}
        style={{
          borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-md)',
        }}
      >
        <option value="">{onlyChildOf ? 'Select a subcategory' : 'Select a category'}</option>
        {items.map((category) => (
          <option key={category.id} value={category.id}>
            {buildLabel(category)}
          </option>
        ))}
      </select>
      {error ? (
        <span id={errorId} style={{ color: 'var(--color-error)' }}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
