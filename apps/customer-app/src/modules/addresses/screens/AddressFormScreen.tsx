import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, ErrorView, Input, ScreenWrapper, Text } from '../../../components/common';
import { spacing } from '../../../theme';
import { getCustomerAddressErrorMessage } from '../utils/customer-address-error-message.util';
import { useCustomerAddresses } from '../hooks/useCustomerAddresses';
import type { AddressesStackParamList } from '../navigation/addresses.navigation';

type AddressFormRoute = RouteProp<AddressesStackParamList, 'AddressForm'>;

export function AddressFormScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AddressesStackParamList>>();
  const route = useRoute<AddressFormRoute>();
  const { createMutation, updateMutation } = useCustomerAddresses();
  const existing = route.params?.address;

  const [label, setLabel] = useState(existing?.label ?? 'Home');
  const [line1, setLine1] = useState(existing?.line1 ?? '');
  const [city, setCity] = useState(existing?.city ?? 'Delhi');
  const [latitude, setLatitude] = useState(String(existing?.latitude ?? '28.5921'));
  const [longitude, setLongitude] = useState(String(existing?.longitude ?? '77.046'));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = existing ? updateMutation : createMutation;

  const onSubmit = async () => {
    setErrorMessage(null);

    const payload = {
      label,
      line1,
      city,
      latitude: Number(latitude),
      longitude: Number(longitude),
      isDefault: existing?.isDefault ?? false,
    };

    try {
      if (existing) {
        await updateMutation.mutateAsync({ addressId: existing.id, input: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }

      navigation.goBack();
    } catch (error) {
      setErrorMessage(getCustomerAddressErrorMessage(error, 'Unable to save address.'));
    }
  };

  return (
    <ScreenWrapper>
      <Text variant="h2">{existing ? 'Edit address' : 'Add address'}</Text>
      <View style={styles.form}>
        <Input label="Label" onChangeText={setLabel} value={label} />
        <Input label="Address line" onChangeText={setLine1} value={line1} />
        <Input label="City" onChangeText={setCity} value={city} />
        <Input label="Latitude" keyboardType="decimal-pad" onChangeText={setLatitude} value={latitude} />
        <Input
          label="Longitude"
          keyboardType="decimal-pad"
          onChangeText={setLongitude}
          value={longitude}
        />
        {errorMessage ? <ErrorView message={errorMessage} /> : null}
        <Button
          disabled={mutation.isPending}
          onPress={() => void onSubmit()}
          title={mutation.isPending ? 'Saving...' : 'Save address'}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
