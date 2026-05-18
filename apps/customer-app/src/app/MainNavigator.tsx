import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { isDevelopment } from '../config/env';
import { DebugScreen } from '../screens/debug/DebugScreen';
import { AuthSmokeTestScreen } from '../screens/main/AuthSmokeTestScreen';
import { CatalogNavigator } from '../modules/catalog/navigation/catalog.navigator';
import { HomeScreen } from '../screens/main/HomeScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { SessionsScreen } from '../screens/main/SessionsScreen';
import type { MainStackParamList } from './navigation.types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Customer Home' }}
      />
      <Stack.Screen
        name="Catalog"
        component={CatalogNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Customer Profile' }}
      />
      <Stack.Screen
        name="Sessions"
        component={SessionsScreen}
        options={{ title: 'Sessions' }}
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
