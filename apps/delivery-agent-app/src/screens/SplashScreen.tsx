import React from 'react';

import { Loader, ScreenWrapper, Text } from '../components/common';

export function SplashScreen() {
  return (
    <ScreenWrapper>
      <Text variant="h2">Delivery Agent App</Text>
      <Loader mode="full-screen" />
    </ScreenWrapper>
  );
}
