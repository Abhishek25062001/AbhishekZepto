import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, spacing } from '../../theme';

type LoaderProps = {
  mode?: 'inline' | 'full-screen';
};

export function Loader({ mode = 'inline' }: LoaderProps) {
  return (
    <View style={[styles.container, mode === 'full-screen' && styles.fullScreen]}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  fullScreen: {
    flex: 1,
  },
});
