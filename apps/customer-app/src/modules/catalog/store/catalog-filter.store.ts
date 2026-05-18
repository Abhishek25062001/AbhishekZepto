import { create } from 'zustand';

import type {
  CustomerCatalogAvailabilityFilter,
  CustomerCatalogListQuery,
  CustomerCatalogSortBy,
} from '../types/customer-catalog-query.types';
import type { FoodType } from '../types/customer-product.types';
import { buildCatalogQuery } from '../utils/catalog-query.util';

export type CatalogFilterState = {
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  foodType?: Exclude<FoodType, null>;
  availability?: CustomerCatalogAvailabilityFilter;
  sortBy?: CustomerCatalogSortBy;
  search?: string;
};

type CatalogFilterStore = CatalogFilterState & {
  setCatalogFilter: <K extends keyof CatalogFilterState>(
    key: K,
    value: CatalogFilterState[K],
  ) => void;
  resetCatalogFilters: () => void;
  toListQuery: (overrides?: Partial<CustomerCatalogListQuery>) => CustomerCatalogListQuery;
};

const initialState: CatalogFilterState = {
  availability: 'all',
  sortBy: 'relevance',
};

export const useCatalogFilterStore = create<CatalogFilterStore>((set, get) => ({
  ...initialState,
  setCatalogFilter: (key, value) => set({ [key]: value }),
  resetCatalogFilters: () =>
    set({
      categoryId: undefined,
      subcategoryId: undefined,
      brandId: undefined,
      foodType: undefined,
      availability: 'all',
      sortBy: 'relevance',
      search: undefined,
    }),
  toListQuery: (overrides = {}) =>
    buildCatalogQuery({
      ...get(),
      ...overrides,
    }),
}));
