import { useEffect, type PropsWithChildren } from 'react';

type ModalProps = PropsWithChildren<{
  footer?: React.ReactNode;
  onClose: () => void;
  open: boolean;
  title?: string;
}>;

export function Modal({ children, footer, onClose, open, title }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="presentation"
      style={{
        alignItems: 'center',
        background: 'rgba(17, 24, 39, 0.45)',
        display: 'flex',
        inset: 0,
        justifyContent: 'center',
        position: 'fixed',
      }}
    >
      <section
        aria-modal="true"
        role="dialog"
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          maxWidth: '520px',
          padding: 'var(--spacing-xl)',
          width: '100%',
        }}
      >
        {title ? <h2>{title}</h2> : null}
        {children}
        {footer ? <footer style={{ marginTop: 'var(--spacing-lg)' }}>{footer}</footer> : null}
        <button onClick={onClose} type="button">
          Close
        </button>
      </section>
    </div>
  );
}
