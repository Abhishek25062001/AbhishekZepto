import React from 'react';

import { EmptyState, ScreenWrapper, Text } from '../../components/common';

export function ProfileScreen() {
  return (
    <ScreenWrapper>
      <Text variant="h2">Customer Profile</Text>
      <EmptyState
        description="Profile details will be added in the owning customer profile module."
        title="Profile details not available yet"
      />
    </ScreenWrapper>
  );
}
