import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Loader, ScreenWrapper, Text } from '../../../components/common';
import type { MainStackParamList } from '../../../app/navigation.types';
import { spacing } from '../../../theme';
import { OrderEmptyState } from '../components/OrderEmptyState';
import { OrderErrorState } from '../components/OrderErrorState';
import { OrderHistoryListItem } from '../components/OrderHistoryListItem';
import { useOrderHistory } from '../hooks/useOrderHistory';

export function OrderHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {
    orders,
    isLoading,
    isError,
    isRefreshing,
    errorMessage,
    refetch,
    page,
    setPage,
    hasNextPage,
    hasPreviousPage,
  } = useOrderHistory();

  if (isLoading && orders.length === 0) {
    return (
      <ScreenWrapper>
        <Loader />
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper>
        <OrderErrorState
          message={errorMessage ?? 'Could not load orders.'}
          onRetry={() => {
            void refetch();
          }}
        />
      </ScreenWrapper>
    );
  }

  if (orders.length === 0) {
    return (
      <ScreenWrapper>
        <OrderEmptyState onStartShopping={() => navigation.navigate('Home')} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false}>
      <FlatList
        contentContainerStyle={styles.list}
        data={orders}
        keyExtractor={(item) => item.orderId}
        onRefresh={() => {
          void refetch();
        }}
        refreshing={isRefreshing}
        ListFooterComponent={
          hasNextPage || hasPreviousPage ? (
            <View style={styles.pagination}>
              <Button
                disabled={!hasPreviousPage || page <= 1}
                onPress={() => setPage((current) => Math.max(1, current - 1))}
                title="Previous"
                variant="secondary"
              />
              <Text color="secondary" variant="small">
                Page {page}
              </Text>
              <Button
                disabled={!hasNextPage}
                onPress={() => setPage((current) => current + 1)}
                title="Next"
                variant="secondary"
              />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <OrderHistoryListItem
            order={item}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.orderId })}
          />
        )}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  pagination: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
});
