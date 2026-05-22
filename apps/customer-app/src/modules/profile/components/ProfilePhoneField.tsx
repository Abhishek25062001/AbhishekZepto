import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Input } from '../../../components/common';
import { spacing } from '../../../theme';

type ProfilePhoneFieldProps = {
  phone: string;
};

export function ProfilePhoneField({ phone }: ProfilePhoneFieldProps) {
  return (
    <View style={styles.container}>
      <Input disabled label="Phone" onChangeText={() => undefined} value={phone} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
});
