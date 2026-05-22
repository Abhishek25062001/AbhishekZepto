import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Loader, ScreenWrapper, Text } from '../../../components/common';
import { spacing } from '../../../theme';
import { StoreSelectionCard } from '../components/StoreSelectionCard';
import { UnserviceableAreaState } from '../components/UnserviceableAreaState';
import { useSelectStore } from '../hooks/useSelectStore';
import { checkServiceability } from '../api/customer-address.api';
import { getCustomerAddressErrorMessage } from '../utils/customer-address-error-message.util';
import type { AddressesStackParamList } from '../navigation/addresses.navigation';
import type { ServiceabilityResult } from '../types/serviceability.types';

type ServiceabilityRoute = RouteProp<AddressesStackParamList, 'Serviceability'>;

export function ServiceabilityScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AddressesStackParamList>>();
  const route = useRoute<ServiceabilityRoute>();
  const [isChecking, setIsChecking] = useState(true);
  const selectStoreMutation = useSelectStore();
  const [result, setResult] = useState<ServiceabilityResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsChecking(true);
      try {
        const response = await checkServiceability({
          latitude: route.params.latitude,
          longitude: route.params.longitude,
          addressId: route.params.addressId,
        });

        if (!cancelled) {
          setResult(response);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            getCustomerAddressErrorMessage(error, 'Unable to check serviceability.'),
          );
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [route.params.addressId, route.params.latitude, route.params.longitude]);

  const onConfirm = async () => {
    if (!result) {
      return;
    }

    await selectStoreMutation.mutateAsync({
      addressId: route.params.addressId,
      storeId: result.storeId,
    });

    navigation.getParent()?.goBack();
  };

  return (
    <ScreenWrapper>
      <Text variant="h2">Check delivery</Text>
      {isChecking ? <Loader /> : null}
      {errorMessage ? (
        <UnserviceableAreaState
          message={errorMessage}
          onChangeAddress={() => navigation.navigate('AddressList')}
        />
      ) : null}
      {result ? (
        <View style={styles.content}>
          <StoreSelectionCard
            isLoading={selectStoreMutation.isPending}
            onConfirm={() => void onConfirm()}
            serviceability={result}
          />
        </View>
      ) : null}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: spacing.lg,
  },
});
