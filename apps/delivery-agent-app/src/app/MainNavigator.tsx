import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { isDevelopment } from '../config/env';
import { DebugScreen } from '../screens/debug/DebugScreen';
import { ActiveDeliveryScreen } from '../screens/main/ActiveDeliveryScreen';
import { AuthSmokeTestScreen } from '../screens/main/AuthSmokeTestScreen';
import { DeliveryHomeScreen } from '../screens/main/DeliveryHomeScreen';
import { PickupConfirmationScreen } from '../screens/main/PickupConfirmationScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { SessionsScreen } from '../screens/main/SessionsScreen';
import { StoreArrivalScreen } from '../screens/main/StoreArrivalScreen';
import { CustomerArrivalScreen } from '../screens/main/CustomerArrivalScreen';
import { NotificationCenterScreen } from '../modules/notification-center/screens/NotificationCenterScreen';
import type { MainStackParamList } from './navigation.types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeliveryHome"
        component={DeliveryHomeScreen}
        options={{ title: 'Delivery Home' }}
      />
      <Stack.Screen
        name="ActiveDelivery"
        component={ActiveDeliveryScreen}
        options={{ title: 'Active Delivery' }}
      />
      <Stack.Screen
        name="NotificationCenter"
        component={NotificationCenterScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Delivery Profile' }}
      />
      <Stack.Screen
        name="Sessions"
        component={SessionsScreen}
        options={{ title: 'Sessions' }}
      />
      <Stack.Screen
        name="StoreArrival"
        component={StoreArrivalScreen}
        options={{ title: 'Store Arrival' }}
      />
      <Stack.Screen
        name="PickupConfirmation"
        component={PickupConfirmationScreen}
        options={{ title: 'Confirm Pickup' }}
      />
      <Stack.Screen
        name="CustomerArrival"
        component={CustomerArrivalScreen}
        options={{ title: 'Arrived at Customer' }}
      />
      {isDevelopment ? (
        <Stack.Screen
          name="AuthSmokeTest"
          component={AuthSmokeTestScreen}
          options={{ title: 'Auth Smoke Test' }}
        />
      ) : null}
      {isDevelopment ? (
        <Stack.Screen
          name="Debug"
          component={DebugScreen}
          options={{ title: 'Debug' }}
        />
      ) : null}
    </Stack.Navigator>
  );
}
