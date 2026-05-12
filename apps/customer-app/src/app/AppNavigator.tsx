import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useRestoreCustomerSession } from '../hooks/useRestoreCustomerSession';
import { SplashScreen } from '../screens/SplashScreen';
import { useAuthStore } from '../store/auth.store';

export function AppNavigator() {
  const { isRestoringSession } = useRestoreCustomerSession();
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
