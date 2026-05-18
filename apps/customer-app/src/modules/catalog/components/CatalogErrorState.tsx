import React from 'react';

import { Button, ErrorView } from '../../../components/common';

type CatalogErrorStateProps = {
  message?: string;
  onRetry: () => void;
};

export function CatalogErrorState({
  message = 'Unable to load catalog. Please try again.',
  onRetry,
}: CatalogErrorStateProps) {
  return (
    <>
      <ErrorView message={message} />
      <Button onPress={onRetry} title="Retry" variant="secondary" />
    </>
  );
}
