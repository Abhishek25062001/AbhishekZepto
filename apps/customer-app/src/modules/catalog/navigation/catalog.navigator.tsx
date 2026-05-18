import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BrandProductsScreen } from '../screens/BrandProductsScreen';
import { CatalogFiltersScreen } from '../screens/CatalogFiltersScreen';
import { CatalogHomeScreen } from '../screens/CatalogHomeScreen';
import { CatalogSearchScreen } from '../screens/CatalogSearchScreen';
import { CategoryProductsScreen } from '../screens/CategoryProductsScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import type { CatalogStackParamList } from './catalog-navigation.types';

const Stack = createNativeStackNavigator<CatalogStackParamList>();

export function CatalogNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={CatalogHomeScreen}
        name="CatalogHome"
        options={{ title: 'Catalog' }}
      />
      <Stack.Screen
        component={CategoryProductsScreen}
        name="CategoryProducts"
        options={({ route }) => ({ title: route.params.categoryName })}
      />
      <Stack.Screen
        component={BrandProductsScreen}
        name="BrandProducts"
        options={({ route }) => ({ title: route.params.brandName })}
      />
      <Stack.Screen
        component={ProductDetailScreen}
        name="ProductDetail"
        options={{ title: 'Product' }}
      />
      <Stack.Screen
        component={CatalogSearchScreen}
        name="CatalogSearch"
        options={{ title: 'Search' }}
      />
      <Stack.Screen
        component={CatalogFiltersScreen}
        name="CatalogFilters"
        options={{ title: 'Filters' }}
      />
    </Stack.Navigator>
  );
}
