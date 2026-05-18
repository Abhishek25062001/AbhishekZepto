import React from 'react';
import { FlatList, type ListRenderItem } from 'react-native';

type CatalogHorizontalListProps<T> = {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: ListRenderItem<T>;
};

export function CatalogHorizontalList<T>({
  data,
  keyExtractor,
  renderItem,
}: CatalogHorizontalListProps<T>) {
  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
    />
  );
}
