import { ErrorView } from '../../../components/common';

type VendorIncomingOrdersErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function VendorIncomingOrdersErrorState({
  message,
  onRetry,
}: VendorIncomingOrdersErrorStateProps) {
  return (
    <ErrorView
      message={message}
      onRetry={onRetry}
      title="Unable to load incoming orders"
    />
  );
}
