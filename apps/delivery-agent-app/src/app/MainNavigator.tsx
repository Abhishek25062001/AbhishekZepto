import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { isDevelopment } from '../config/env';
import { DebugScreen } from '../screens/debug/DebugScreen';
import { ActiveDeliveryScreen } from '../screens/main/ActiveDeliveryScreen';
import { DeliveryHomeScreen } from '../screens/main/DeliveryHomeScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
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
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Delivery Profile' }}
      />
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
