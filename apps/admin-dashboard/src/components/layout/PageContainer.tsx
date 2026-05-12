import type { PropsWithChildren } from 'react';

type PageContainerProps = PropsWithChildren<{
  title?: string;
}>;

export function PageContainer({ title, children }: PageContainerProps) {
  return (
    <section style={{ padding: '24px' }}>
      {title ? <h1>{title}</h1> : null}
      {children}
    </section>
  );
}
