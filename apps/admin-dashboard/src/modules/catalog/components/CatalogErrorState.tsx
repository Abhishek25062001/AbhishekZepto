import { ErrorView } from '../../../components/common';

type CatalogErrorStateProps = {
  message?: string;
  onRetry?: () => void;
  title?: string;
};

export function CatalogErrorState({
  message = 'Unable to load catalog data.',
  onRetry,
  title = 'Something went wrong',
}: CatalogErrorStateProps) {
  return <ErrorView message={message} retryLabel="Try again" title={title} onRetry={onRetry} />;
}
