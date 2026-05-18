import { EmptyState } from '../../../components/common';

type CatalogEmptyStateProps = {
  actionLabel?: string;
  description?: string;
  onAction?: () => void;
  title?: string;
};

export function CatalogEmptyState({
  actionLabel,
  description,
  onAction,
  title = 'No catalog records',
}: CatalogEmptyStateProps) {
  return (
    <EmptyState
      actionLabel={actionLabel}
      description={description}
      title={title}
      onAction={onAction}
    />
  );
}
