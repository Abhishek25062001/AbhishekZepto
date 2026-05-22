import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CatalogNavigator } from '../../catalog/navigation/catalog.navigator';
import { CartBottomBar } from './CartBottomBar';

/** Catalog stack with persistent cart bottom bar. */
export function CatalogWithCartBar() {
  return (
    <View style={styles.container}>
      <View style={styles.navigator}>
        <CatalogNavigator />
      </View>
      <CartBottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigator: {
    flex: 1,
  },
});
