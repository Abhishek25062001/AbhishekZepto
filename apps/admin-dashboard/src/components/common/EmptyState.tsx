type EmptyStateProps = {
  actionLabel?: string;
  description?: string;
  message?: string;
  onAction?: () => void;
  title?: string;
};

export function EmptyState({
  actionLabel,
  description,
  message,
  onAction,
  title = 'No data',
}: EmptyStateProps) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{description ?? message ?? 'There is nothing to show yet.'}</p>
      {actionLabel && onAction ? (
        <button onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
