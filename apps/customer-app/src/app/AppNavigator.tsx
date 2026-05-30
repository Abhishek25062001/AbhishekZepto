import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { resolveMobileAuthGuardSurface } from '../access-control/mobile-auth-guard.util';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useRestoreCustomerSession } from '../hooks/useRestoreCustomerSession';
import { SplashScreen } from '../screens/SplashScreen';
import { useAuthStore } from '../store/auth.store';
import { useCustomerRealtimeSocket } from '../modules/realtime-order-experience/hooks/useCustomerRealtimeSocket';
import { customerNavigationRef } from './navigation-ref';
import { useCustomerPushMessageHandling } from '../modules/push-notifications/hooks/useCustomerPushMessageHandling';
import { useCustomerPushNotifications } from '../modules/push-notifications/hooks/useCustomerPushNotifications';

export function AppNavigator() {
  const { isRestoringSession } = useRestoreCustomerSession();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  useCustomerRealtimeSocket();
  useCustomerPushNotifications();
  useCustomerPushMessageHandling();
  const guardSurface = resolveMobileAuthGuardSurface({
    isRestoringSession,
    isAuthenticated,
  });

  if (guardSurface === 'splash') {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={customerNavigationRef}>
      {guardSurface === 'main' ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
