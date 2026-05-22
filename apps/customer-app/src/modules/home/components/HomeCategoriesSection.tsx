import React from 'react';

import { Text } from '../../../components/common';
import { CatalogHorizontalList } from '../../catalog/components/CatalogHorizontalList';
import { CatalogSectionHeader } from '../../catalog/components/CatalogSectionHeader';
import { CategoryCard } from '../../catalog/components/CategoryCard';
import type { CustomerCategory } from '../../catalog/types/customer-category.types';

type HomeCategoriesSectionProps = {
  categories: CustomerCategory[];
  onPressCategory: (category: CustomerCategory) => void;
};

export function HomeCategoriesSection({
  categories,
  onPressCategory,
}: HomeCategoriesSectionProps) {
  if (categories.length === 0) {
    return <Text color="secondary" variant="small">No categories available.</Text>;
  }

  return (
    <>
      <CatalogSectionHeader title="Categories" />
      <CatalogHorizontalList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CategoryCard category={item} onPress={onPressCategory} />}
      />
    </>
  );
}
