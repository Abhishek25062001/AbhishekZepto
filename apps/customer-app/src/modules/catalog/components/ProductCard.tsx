import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { CustomerProduct } from '../types/customer-product.types';
import {
  calculateDiscountPercentage,
  formatProductPrice,
} from '../utils/catalog-price.util';
import { getProductImage } from '../utils/catalog-image.util';
import { getProductCardBadgeState } from './product-card-display.util';
import { FoodTypeBadge } from './FoodTypeBadge';

type ProductCardProps = {
  onPress: (product: CustomerProduct) => void;
  product: CustomerProduct;
};

export function ProductCard({ onPress, product }: ProductCardProps) {
  const imageUrl = getProductImage(product);
  const { showDiscount, showOutOfStock } = getProductCardBadgeState(product);
  const displayPrice = product.finalPrice ?? product.sellingPrice ?? product.mrp;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(product)}
      style={styles.card}
    >
      <View style={styles.imagePlaceholder}>
        {imageUrl ? <Text variant="small">IMG</Text> : null}
      </View>
      {showDiscount && product.mrp != null && product.finalPrice != null ? (
        <View style={styles.discountBadge}>
          <Text color="secondary" variant="small">
            {calculateDiscountPercentage(product.mrp, product.finalPrice)}% off
          </Text>
        </View>
      ) : null}
      {showOutOfStock ? (
        <View style={styles.outOfStockBadge}>
          <Text color="secondary" variant="small">
            Out of stock
          </Text>
        </View>
      ) : null}
      <Text variant="small">{product.name}</Text>
      {product.foodType ? <FoodTypeBadge foodType={product.foodType} /> : null}
      {displayPrice != null ? (
        <Text variant="small">{formatProductPrice(displayPrice)}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    margin: spacing.xs,
    padding: spacing.sm,
  },
  discountBadge: {
    backgroundColor: colors.success,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  imagePlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    height: 80,
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  outOfStockBadge: {
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
});
