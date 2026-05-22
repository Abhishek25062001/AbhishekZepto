import { ErrorView } from '../../../components/common';

export function VendorActiveOrdersErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <ErrorView
      message={message}
      onRetry={onRetry}
      title="Unable to load active orders"
    />
  );
}
