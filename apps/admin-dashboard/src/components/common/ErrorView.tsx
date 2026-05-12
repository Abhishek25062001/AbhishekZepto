type ErrorViewProps = {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  title?: string;
};

export function ErrorView({
  message = 'Something went wrong.',
  onRetry,
  retryLabel = 'Retry',
  title = 'Error',
}: ErrorViewProps) {
  return (
    <section role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry ? (
        <button onClick={onRetry} type="button">
          {retryLabel}
        </button>
      ) : null}
    </section>
  );
}
