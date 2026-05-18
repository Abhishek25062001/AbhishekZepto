import { ErrorView } from '../../../components/common';

export function VendorCatalogErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return <ErrorView message={message} onRetry={onRetry} />;
}
