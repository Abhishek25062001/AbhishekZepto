import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { CustomerProductVariant } from '../types/customer-product-variant.types';
import { formatProductPrice } from '../utils/catalog-price.util';

type ProductVariantSelectorProps = {
  onSelect?: (variant: CustomerProductVariant) => void;
  variants: CustomerProductVariant[];
};

export function ProductVariantSelector({ onSelect, variants }: ProductVariantSelectorProps) {
  const defaultVariant = variants.find((variant) => variant.isDefault) ?? variants[0];
  const [selectedId, setSelectedId] = useState<string | undefined>(defaultVariant?.id);

  useEffect(() => {
    if (defaultVariant) {
      setSelectedId(defaultVariant.id);
      onSelect?.(defaultVariant);
    }
  }, [defaultVariant, onSelect]);

  if (variants.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="h3">Select variant</Text>
      {variants.map((variant) => {
        const isSelected = variant.id === selectedId;
        return (
          <Pressable
            key={variant.id}
            onPress={() => {
              setSelectedId(variant.id);
              onSelect?.(variant);
            }}
            style={[styles.option, isSelected && styles.optionSelected]}
          >
            <Text variant="small">
              {variant.variantName} ({variant.unitValue} {variant.unit})
            </Text>
            <Text color="secondary" variant="small">
              {formatProductPrice(variant.mrp)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  option: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  optionSelected: {
    borderColor: colors.primary,
  },
});
