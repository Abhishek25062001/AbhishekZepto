import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Loader, ScreenWrapper, Text } from '../../../components/common';
import { spacing } from '../../../theme';
import type { MainStackParamList } from '../../../app/navigation.types';
import { useLocationContext } from '../hooks/useLocationContext';

export function LocationGateScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { hasStore, isHydrated, selectedStoreName } = useLocationContext();

  React.useEffect(() => {
    if (isHydrated && hasStore) {
      navigation.replace('Home');
    }
  }, [hasStore, isHydrated, navigation]);

  if (!isHydrated) {
    return (
      <ScreenWrapper>
        <Loader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Text variant="h2">Choose delivery location</Text>
      <Text color="secondary" variant="body">
        Add an address and select a store to start shopping.
      </Text>
      {selectedStoreName ? (
        <Text color="secondary" variant="small">
          Last store: {selectedStoreName}
        </Text>
      ) : null}
      <View style={styles.actions}>
        <Button
          onPress={() => navigation.navigate('Addresses', { screen: 'AddressList' })}
          title="Manage addresses"
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: spacing.lg,
  },
});
