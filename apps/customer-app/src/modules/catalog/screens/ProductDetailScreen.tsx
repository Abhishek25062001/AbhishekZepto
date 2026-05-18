import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { AxiosError } from 'axios';

import { Button, Loader, ScreenWrapper, Text } from '../../../components/common';
import type { ApiErrorResponse } from '../../../types/api.types';
import {
  AvailabilityBadge,
  getAvailabilityState,
} from '../components/AvailabilityBadge';
import { CatalogErrorState } from '../components/CatalogErrorState';
import { FoodTypeBadge } from '../components/FoodTypeBadge';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { ProductPriceBlock } from '../components/ProductPriceBlock';
import { ProductVariantSelector } from '../components/ProductVariantSelector';
import { useCustomerProductDetail } from '../hooks/useCustomerProductDetail';
import { useCustomerProductVariants } from '../hooks/useCustomerProductVariants';
import type { CatalogStackParamList } from '../navigation/catalog-navigation.types';
import {
  getCustomerCatalogErrorMessage,
  isProductUnavailableError,
} from '../utils/customer-catalog-error-message.util';
import { addRecentlyViewedProduct } from '../utils/recently-viewed-products.util';

export function ProductDetailScreen() {
  const route = useRoute<RouteProp<CatalogStackParamList, 'ProductDetail'>>();
  const { productId } = route.params;

  const detailQuery = useCustomerProductDetail(productId);
  const variantsQuery = useCustomerProductVariants(productId);

  const product = detailQuery.data;
  const errorCode = (detailQuery.error as AxiosError<ApiErrorResponse> | undefined)?.response
    ?.data?.error?.code;

  useEffect(() => {
    if (product?.id) {
      void addRecentlyViewedProduct(product.id);
    }
  }, [product?.id]);

  const availabilityState = getAvailabilityState(product?.isAvailable, product?.isOutOfStock);
  const addToCartDisabled =
    product?.isAvailable === false || product?.isOutOfStock === true || !product;

  if (detailQuery.isLoading) {
    return (
      <ScreenWrapper>
        <Loader />
      </ScreenWrapper>
    );
  }

  if (detailQuery.isError && isProductUnavailableError(errorCode)) {
    return (
      <ScreenWrapper>
        <Text variant="h3">Product unavailable</Text>
        <Text color="secondary" variant="small">
          {getCustomerCatalogErrorMessage(errorCode)}
        </Text>
      </ScreenWrapper>
    );
  }

  if (detailQuery.isError || !product) {
    return (
      <ScreenWrapper>
        <CatalogErrorState
          message={getCustomerCatalogErrorMessage(errorCode)}
          onRetry={() => void detailQuery.refetch()}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false}>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              void detailQuery.refetch();
              void variantsQuery.refetch();
            }}
            refreshing={detailQuery.isFetching || variantsQuery.isFetching}
          />
        }
      >
        <ProductImageGallery isLoading={detailQuery.isLoading} product={product} />
        <Text variant="h2">{product.name}</Text>
        <ProductPriceBlock finalPrice={product.finalPrice} mrp={product.mrp} />
        {product.foodType ? <FoodTypeBadge foodType={product.foodType} /> : null}
        <AvailabilityBadge state={availabilityState} />
        <ProductVariantSelector variants={variantsQuery.data ?? []} />
        {product.description ? (
          <View style={styles.section}>
            <Text variant="h3">Description</Text>
            <Text color="secondary" variant="small">
              {product.description}
            </Text>
          </View>
        ) : null}
        <View style={styles.section}>
          <Text variant="h3">Product information</Text>
          <Text color="secondary" variant="small">
            Type: {product.productType}
          </Text>
          {product.hsnCode ? (
            <Text color="secondary" variant="small">
              HSN: {product.hsnCode}
            </Text>
          ) : null}
        </View>
        <View style={styles.section}>
          <Text color="secondary" variant="small">
            Similar products — coming soon
          </Text>
        </View>
        <Button
          disabled
          onPress={() => undefined}
          title={addToCartDisabled ? 'Add to Cart — coming soon' : 'Add to Cart — coming soon'}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 12,
  },
});
