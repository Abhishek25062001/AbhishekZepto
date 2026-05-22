import React from 'react';
import { Pressable, StyleSheet, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../../app/navigation.types';
import { colors, radius, spacing } from '../../../theme';
import { useCustomerCart } from '../hooks/useCustomerCart';
import { formatCartGrandTotal } from '../utils/cart-price.util';

export function CartBottomBar() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { cart, hasItems, itemCount, grandTotal } = useCustomerCart();
  const hasFees =
    (cart?.taxAmount ?? 0) > 0 || (cart?.deliveryFeeAmount ?? 0) > 0;

  if (!hasItems) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('Cart')}
        style={styles.bar}
      >
        <View>
          <RNText style={styles.barText}>
            {itemCount} item{itemCount === 1 ? '' : 's'}
          </RNText>
          <RNText style={styles.barTextMuted}>
            {hasFees ? 'incl. tax & delivery' : 'View cart'}
          </RNText>
        </View>
        <RNText style={styles.barTextTotal}>{formatCartGrandTotal(grandTotal)}</RNText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  bar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  barText: {
    color: colors.surface,
    fontSize: 14,
  },
  barTextMuted: {
    color: colors.primaryLight,
    fontSize: 12,
  },
  barTextTotal: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '700',
  },
});
