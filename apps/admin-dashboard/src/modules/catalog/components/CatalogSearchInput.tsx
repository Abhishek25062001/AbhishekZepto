import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button, Input } from '../../../components/common';
import { setSearchParams } from '../utils/catalog-query-param.util';

type CatalogSearchInputProps = {
  paramName?: string;
  placeholder?: string;
};

export function CatalogSearchInput({ paramName = 'search', placeholder = 'Search…' }: CatalogSearchInputProps) {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const [value, setValue] = useState(() => searchParams.get(paramName) ?? '');

  useEffect(() => {
    setValue(searchParams.get(paramName) ?? '');
  }, [paramName, searchParams]);

  const apply = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    setSearchParams(params, {
      [paramName]: value.trim() ? value.trim() : null,
      page: 1,
    });
    setUrlSearchParams(params, { replace: true });
  }, [paramName, searchParams, setUrlSearchParams, value]);

  return (
    <div style={{ alignItems: 'flex-end', display: 'flex', gap: 'var(--spacing-md)', maxWidth: 480 }}>
      <div style={{ flex: 1 }}>
        <Input
          label="Search"
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              apply();
            }
          }}
          placeholder={placeholder}
          value={value}
        />
      </div>
      <Button type="button" variant="secondary" onClick={apply}>
        Apply
      </Button>
    </div>
  );
}
