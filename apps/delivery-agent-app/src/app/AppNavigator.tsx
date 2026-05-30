import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { resolveMobileAuthGuardSurface } from '../access-control/mobile-auth-guard.util';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useRestoreDeliverySession } from '../hooks/useRestoreDeliverySession';
import { useDeliveryRealtimeEvents } from '../modules/realtime-operations/hooks/useDeliveryRealtimeEvents';
import { useDeliveryRealtimeSocket } from '../modules/realtime-operations/hooks/useDeliveryRealtimeSocket';
import { SplashScreen } from '../screens/SplashScreen';
import { useAuthStore } from '../store/auth.store';
import { deliveryNavigationRef } from './navigation-ref';
import { useDeliveryPushMessageHandling } from '../modules/push-notifications/hooks/useDeliveryPushMessageHandling';
import { useDeliveryPushNotifications } from '../modules/push-notifications/hooks/useDeliveryPushNotifications';

export function AppNavigator() {
  const { isRestoringSession } = useRestoreDeliverySession();
  useDeliveryRealtimeSocket();
  useDeliveryRealtimeEvents();
  useDeliveryPushNotifications();
  useDeliveryPushMessageHandling();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const guardSurface = resolveMobileAuthGuardSurface({
    isRestoringSession,
    isAuthenticated,
  });

  if (guardSurface === 'splash') {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={deliveryNavigationRef}>
      {guardSurface === 'main' ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
