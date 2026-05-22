import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, EmptyState, ErrorView, Loader, ScreenWrapper, Text } from '../../../components/common';
import { spacing } from '../../../theme';
import { AddressCard } from '../components/AddressCard';
import { useCustomerAddresses } from '../hooks/useCustomerAddresses';
import type { AddressesStackParamList } from '../navigation/addresses.navigation';
import type { CustomerAddress } from '../types/customer-address.types';

export function AddressListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AddressesStackParamList>>();
  const { query, deleteMutation, setDefaultMutation } = useCustomerAddresses();

  const openCreate = () => navigation.navigate('AddressForm');
  const openEdit = (address: CustomerAddress) =>
    navigation.navigate('AddressForm', { address });
  const openServiceability = (address: CustomerAddress) =>
    navigation.navigate('Serviceability', {
      addressId: address.id,
      latitude: address.latitude,
      longitude: address.longitude,
    });

  return (
    <ScreenWrapper>
      <Text variant="h2">Delivery addresses</Text>
      <Button onPress={openCreate} title="Add address" />
      {query.isLoading ? <Loader /> : null}
      {query.isError ? <ErrorView message="Unable to load addresses." /> : null}
      {!query.isLoading && (query.data?.length ?? 0) === 0 ? (
        <EmptyState description="Add an address to check store availability." title="No addresses" />
      ) : null}
      <View style={styles.list}>
        {query.data?.map((address) => (
          <AddressCard
            address={address}
            key={address.id}
            onDelete={(item) => void deleteMutation.mutateAsync(item.id)}
            onEdit={openEdit}
            onSelect={openServiceability}
            onSetDefault={(item) => void setDefaultMutation.mutateAsync(item.id)}
          />
        ))}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: spacing.lg,
  },
});
