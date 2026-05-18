import React from 'react';

import { EmptyState } from '../../../components/common';

export type CatalogEmptyVariant =
  | 'no_categories'
  | 'no_products'
  | 'no_search_results'
  | 'no_brands';

const MESSAGES: Record<CatalogEmptyVariant, { title: string; description: string }> = {
  no_categories: {
    title: 'No categories',
    description: 'Categories will appear here when available.',
  },
  no_products: {
    title: 'No products',
    description: 'Try another category or filter.',
  },
  no_search_results: {
    title: 'No results',
    description: 'Try a different search term.',
  },
  no_brands: {
    title: 'No brands',
    description: 'Brands will appear here when available.',
  },
};

type CatalogEmptyStateProps = {
  variant: CatalogEmptyVariant;
};

export function CatalogEmptyState({ variant }: CatalogEmptyStateProps) {
  const message = MESSAGES[variant];
  return <EmptyState description={message.description} title={message.title} />;
}
