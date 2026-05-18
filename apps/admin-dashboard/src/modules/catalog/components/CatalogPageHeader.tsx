import { Link } from 'react-router-dom';
import type { PermissionCode } from '../../../../../../packages/shared/api';

import { CanAccess } from '../../../components/auth/CanAccess';

type CatalogPageHeaderProps = {
  title: string;
  description?: string;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  requiredPermission?: PermissionCode;
};

export function CatalogPageHeader({
  title,
  description,
  primaryActionLabel,
  primaryActionHref,
  requiredPermission = 'catalog:create',
}: CatalogPageHeaderProps) {
  return (
    <header
      style={{
        alignItems: 'flex-start',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-lg)',
      }}
    >
      <div>
        <h1 style={{ margin: 0 }}>{title}</h1>
        {description ? (
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>{description}</p>
        ) : null}
      </div>
      {primaryActionLabel && primaryActionHref ? (
        <CanAccess permission={requiredPermission}>
          <Link to={primaryActionHref}>{primaryActionLabel}</Link>
        </CanAccess>
      ) : null}
    </header>
  );
}
