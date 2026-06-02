import { useState } from 'react';

import { Button, EmptyState, ErrorView, Loader } from '../../components/common';
import { PlatformSettingsFilterBar } from '../../modules/platform-settings/components/PlatformSettingsFilterBar';
import { PlatformSettingsTable } from '../../modules/platform-settings/components/PlatformSettingsTable';
import { PLATFORM_SETTING_DEFAULT_FILTERS } from '../../modules/platform-settings/constants/platform-settings.constants';
import { usePlatformSettings } from '../../modules/platform-settings/hooks/usePlatformSettings';
import type { PlatformSettingsListQuery } from '../../modules/platform-settings/types/platform-settings.types';
import { getApiErrorMessage } from '../../utils/error-message.util';

export function PlatformSettingsPage() {
  const [filters, setFilters] = useState<PlatformSettingsListQuery>(PLATFORM_SETTING_DEFAULT_FILTERS);
  const { data, error, isLoading, refetch } = usePlatformSettings(filters);
  const settings = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0 }}>Platform Settings</h1>
        </div>
        <Button onClick={() => void refetch()} type="button" variant="outline">
          Refresh
        </Button>
      </header>

      <PlatformSettingsFilterBar filters={filters} onChange={setFilters} />

      {error ? (
        <ErrorView
          message={getApiErrorMessage(error, 'Unable to load platform settings.')}
          onRetry={() => void refetch()}
          title="Unable to load platform settings"
        />
      ) : null}

      {isLoading ? <Loader label="Loading platform settings..." /> : null}

      {!error ? <PlatformSettingsTable loading={isLoading} settings={settings} /> : null}

      {!isLoading && !error && settings.length === 0 ? (
        <EmptyState
          description="No platform settings match the current filters."
          title="No platform settings found"
        />
      ) : null}

      {pagination ? (
        <footer style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-md)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} settings
          </span>
          <Button
            disabled={!pagination.hasPreviousPage}
            onClick={() => setFilters(previous => ({
              ...previous,
              page: Math.max(1, (previous.page ?? 1) - 1),
            }))}
            size="sm"
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={!pagination.hasNextPage}
            onClick={() => setFilters(previous => ({
              ...previous,
              page: (previous.page ?? 1) + 1,
            }))}
            size="sm"
            type="button"
            variant="outline"
          >
            Next
          </Button>
        </footer>
      ) : null}
    </div>
  );
}
