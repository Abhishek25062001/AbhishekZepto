import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { resolveMobileAuthGuardSurface } from '../access-control/mobile-auth-guard.util';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useRestoreDeliverySession } from '../hooks/useRestoreDeliverySession';
import { SplashScreen } from '../screens/SplashScreen';
import { useAuthStore } from '../store/auth.store';

export function AppNavigator() {
  const { isRestoringSession } = useRestoreDeliverySession();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const guardSurface = resolveMobileAuthGuardSurface({
    isRestoringSession,
    isAuthenticated,
  });

  if (guardSurface === 'splash') {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {guardSurface === 'main' ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
