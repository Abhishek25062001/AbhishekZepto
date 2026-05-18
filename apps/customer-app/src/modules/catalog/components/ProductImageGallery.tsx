import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Loader, Text } from '../../../components/common';
import { colors, radius, spacing } from '../../../theme';
import type { CustomerProduct } from '../types/customer-product.types';
import { getProductImage } from '../utils/catalog-image.util';

type ProductImageGalleryProps = {
  isLoading?: boolean;
  product: Pick<CustomerProduct, 'defaultImageUrl' | 'imageUrls' | 'name'>;
};

export function ProductImageGallery({ isLoading = false, product }: ProductImageGalleryProps) {
  const images =
    product.imageUrls.length > 0
      ? product.imageUrls
      : getProductImage(product)
        ? [getProductImage(product) as string]
        : [];

  if (isLoading) {
    return <Loader />;
  }

  if (images.length === 0) {
    return (
      <View style={styles.fallback}>
        <Text color="secondary" variant="small">
          Image unavailable
        </Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {images.map((url) => (
        <View key={url} style={styles.slide}>
          <Text color="secondary" variant="small">
            {url}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    height: 200,
    justifyContent: 'center',
  },
  slide: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    height: 200,
    justifyContent: 'center',
    marginRight: spacing.sm,
    padding: spacing.md,
    width: 280,
  },
});
