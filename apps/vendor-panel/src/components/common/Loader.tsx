type LoaderProps = {
  label?: string;
  mode?: 'inline' | 'page';
};

export function Loader({ label = 'Loading...', mode = 'inline' }: LoaderProps) {
  return (
    <p
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: mode === 'page' ? 'center' : 'flex-start',
        minHeight: mode === 'page' ? '240px' : undefined,
      }}
    >
      {label}
    </p>
  );
}
