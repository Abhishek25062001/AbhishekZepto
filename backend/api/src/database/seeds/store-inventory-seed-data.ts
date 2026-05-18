import { CATALOG_PRODUCT_SEEDS } from './catalog-seed-data';

export type StoreInventoryVariantSeed = {
  productSlug: string;
  variantSku: string;
  availableQuantity: number;
  lowStockThreshold: number;
  reorderLevel: number;
};

const DEFAULT_AVAILABLE_QUANTITY = 50;
const DEFAULT_LOW_STOCK_THRESHOLD = 10;
const DEFAULT_REORDER_LEVEL = 15;

const QUANTITY_OVERRIDES: Partial<
  Record<string, Pick<StoreInventoryVariantSeed, 'availableQuantity' | 'lowStockThreshold' | 'reorderLevel'>>
> = {
  'SEED-BANANA-DOZEN': {
    availableQuantity: 8,
    lowStockThreshold: 10,
    reorderLevel: 12,
  },
  'SEED-PAMPERS-M': {
    availableQuantity: 25,
    lowStockThreshold: 5,
    reorderLevel: 10,
  },
};

export const STORE_INVENTORY_VARIANT_SEEDS: StoreInventoryVariantSeed[] = CATALOG_PRODUCT_SEEDS.flatMap(
  (product) =>
    product.variants.map((variant) => {
      const override = QUANTITY_OVERRIDES[variant.sku];

      return {
        productSlug: product.slug,
        variantSku: variant.sku,
        availableQuantity: override?.availableQuantity ?? DEFAULT_AVAILABLE_QUANTITY,
        lowStockThreshold: override?.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD,
        reorderLevel: override?.reorderLevel ?? DEFAULT_REORDER_LEVEL,
      };
    }),
);
