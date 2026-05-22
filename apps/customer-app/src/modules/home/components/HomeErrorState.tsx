import React from 'react';

import { Button, ErrorView } from '../../../components/common';

type HomeErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function HomeErrorState({ message, onRetry }: HomeErrorStateProps) {
  return (
    <>
      <ErrorView message={message} />
      <Button onPress={onRetry} title="Retry" variant="secondary" />
    </>
  );
}
