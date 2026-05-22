import React from 'react';

import { EmptyState } from '../../../components/common';

export function HomeEmptyState() {
  return (
    <EmptyState
      description="Select a delivery store to see your home feed."
      title="No store selected"
    />
  );
}
