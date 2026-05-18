import { ErrorView } from '../../../components/common';

export function VendorInventoryErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return <ErrorView message={message} onRetry={onRetry} />;
}
