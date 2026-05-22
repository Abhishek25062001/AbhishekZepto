import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { isDevelopment } from '../config/env';
import { DebugScreen } from '../screens/debug/DebugScreen';
import { AuthSmokeTestScreen } from '../screens/main/AuthSmokeTestScreen';
import { AddressesNavigator } from '../modules/addresses/navigation/addresses.navigation';
import { LocationGateScreen } from '../modules/addresses/screens/LocationGateScreen';
import { CartScreen } from '../modules/cart/screens/CartScreen';
import { CheckoutScreen } from '../modules/checkout/screens/CheckoutScreen';
import { OrderDetailScreen } from '../modules/orders/screens/OrderDetailScreen';
import { OrderHistoryScreen } from '../modules/orders/screens/OrderHistoryScreen';
import { OrderSuccessScreen } from '../modules/orders/screens/OrderSuccessScreen';
import { CatalogWithCartBar } from '../modules/cart/components/CatalogWithCartBar';
import { CustomerHomeScreen } from '../modules/home/screens/CustomerHomeScreen';
import { DevHomeScreen } from '../screens/main/HomeScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { SessionsScreen } from '../screens/main/SessionsScreen';
import type { MainStackParamList } from './navigation.types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="LocationGate">
      <Stack.Screen
        name="LocationGate"
        component={LocationGateScreen}
        options={{ title: 'Delivery location' }}
      />
      <Stack.Screen
        name="Home"
        component={CustomerHomeScreen}
        options={{ title: 'Shop', headerShown: false }}
      />
      {isDevelopment ? (
        <Stack.Screen
          name="DevHome"
          component={DevHomeScreen}
          options={{ title: 'Dev Home' }}
        />
      ) : null}
      <Stack.Screen
        name="Addresses"
        component={AddressesNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ title: 'Order confirmed' }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Order details' }}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ title: 'My orders' }}
      />
      <Stack.Screen
        name="Catalog"
        component={CatalogWithCartBar}
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
