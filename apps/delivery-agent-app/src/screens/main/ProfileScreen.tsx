import React from 'react';

import { EmptyState, ScreenWrapper, Text } from '../../components/common';

export function ProfileScreen() {
  return (
    <ScreenWrapper>
      <Text variant="h2">Delivery Profile</Text>
      <EmptyState
        description="Delivery profile details will be added in the owning delivery profile module."
        title="Delivery profile details not available yet"
      />
    </ScreenWrapper>
  );
}
