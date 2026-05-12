import React from 'react';

import { EmptyState, ScreenWrapper, Text } from '../../components/common';

export function ActiveDeliveryScreen() {
  return (
    <ScreenWrapper>
      <Text variant="h2">Active Delivery</Text>
      <EmptyState
        description="Active delivery details will be added in the delivery lifecycle module."
        title="No active delivery"
      />
    </ScreenWrapper>
  );
}
