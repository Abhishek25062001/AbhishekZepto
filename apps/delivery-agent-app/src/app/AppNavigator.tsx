import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useRestoreDeliverySession } from '../hooks/useRestoreDeliverySession';
import { SplashScreen } from '../screens/SplashScreen';
import { useAuthStore } from '../store/auth.store';

export function AppNavigator() {
  const { isRestoringSession } = useRestoreDeliverySession();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isRestoringSession) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
