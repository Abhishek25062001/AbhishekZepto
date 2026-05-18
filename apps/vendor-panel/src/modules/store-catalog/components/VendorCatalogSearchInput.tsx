import type { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Input } from '../../../components/common';
import { setSearchParams } from '../utils/vendor-catalog-query-param.util';

export function VendorCatalogSearchInput({ placeholder = 'Search…' }: { placeholder?: string }) {
  const [searchParams, setUrlSearchParams] = useSearchParams();

  return (
    <Input
      defaultValue={searchParams.get('search') ?? ''}
      label="Search"
      placeholder={placeholder}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        setSearchParams(params, { page: 1, search: event.target.value || null });
        setUrlSearchParams(params, { replace: true });
      }}
    />
  );
}
