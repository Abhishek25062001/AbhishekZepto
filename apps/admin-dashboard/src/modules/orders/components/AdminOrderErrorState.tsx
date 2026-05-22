import { ErrorView } from '../../../components/common';

type AdminOrderErrorStateProps = {
  onRetry: () => void;
};

export function AdminOrderErrorState({ onRetry }: AdminOrderErrorStateProps) {
  return (
    <ErrorView
      message="Unable to load admin orders."
      onRetry={onRetry}
      title="Order data unavailable"
    />
  );
}
