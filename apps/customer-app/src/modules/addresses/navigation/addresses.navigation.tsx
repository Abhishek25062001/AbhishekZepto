import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddressFormScreen } from '../screens/AddressFormScreen';
import { AddressListScreen } from '../screens/AddressListScreen';
import { ServiceabilityScreen } from '../screens/ServiceabilityScreen';
import type { CustomerAddress } from '../types/customer-address.types';

export type AddressesStackParamList = {
  AddressList: undefined;
  AddressForm: { address?: CustomerAddress } | undefined;
  Serviceability: {
    addressId: string;
    latitude: number;
    longitude: number;
  };
};

const Stack = createNativeStackNavigator<AddressesStackParamList>();

export function AddressesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={AddressListScreen}
        name="AddressList"
        options={{ title: 'Addresses' }}
      />
      <Stack.Screen
        component={AddressFormScreen}
        name="AddressForm"
        options={{ title: 'Address' }}
      />
      <Stack.Screen
        component={ServiceabilityScreen}
        name="Serviceability"
        options={{ title: 'Store availability' }}
      />
    </Stack.Navigator>
  );
}
