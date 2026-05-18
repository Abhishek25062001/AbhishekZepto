import type { BaseUnit } from '../../modules/catalog/units/constants/base-unit.constant';
import type { FoodType } from '../../modules/catalog/products/constants/food-type.constant';
import type { ProductType } from '../../modules/catalog/products/constants/product-type.constant';

export type CatalogCategorySeed = {
  name: string;
  slug: string;
  displayOrder: number;
  isFeatured?: boolean;
};

export type CatalogBrandSeed = {
  name: string;
  slug: string;
  isFeatured?: boolean;
};

export type CatalogUnitSeed = {
  code: string;
  name: string;
  baseUnit: BaseUnit;
  conversionFactor: number;
};

export type CatalogVariantSeed = {
  sku: string;
  variantName: string;
  unit: string;
  unitValue: number;
  mrp: number;
  defaultSellingPrice: number;
  isDefault?: boolean;
};

export type CatalogProductSeed = {
  name: string;
  slug: string;
  categorySlug: string;
  brandSlug: string;
  productType: ProductType;
  foodType: FoodType;
  shortDescription: string;
  searchKeywords: string[];
  isFeatured?: boolean;
  variants: CatalogVariantSeed[];
};

export const CATALOG_CATEGORY_SEEDS: CatalogCategorySeed[] = [
  { name: 'Fruits & Vegetables', slug: 'fruits-vegetables', displayOrder: 1, isFeatured: true },
  { name: 'Dairy, Bread & Eggs', slug: 'dairy-bread-eggs', displayOrder: 2, isFeatured: true },
  { name: 'Atta, Rice, Oil & Dals', slug: 'atta-rice-oil-dals', displayOrder: 3, isFeatured: true },
  { name: 'Masala & Dry Fruits', slug: 'masala-dry-fruits', displayOrder: 4 },
  { name: 'Packaged Food', slug: 'packaged-food', displayOrder: 5 },
  { name: 'Beverages', slug: 'beverages', displayOrder: 6 },
  { name: 'Personal Care', slug: 'personal-care', displayOrder: 7 },
  { name: 'Home Care', slug: 'home-care', displayOrder: 8 },
  { name: 'Baby Care', slug: 'baby-care', displayOrder: 9 },
  { name: 'Pet Care', slug: 'pet-care', displayOrder: 10 },
];

export const CATALOG_BRAND_SEEDS: CatalogBrandSeed[] = [
  { name: 'Amul', slug: 'amul', isFeatured: true },
  { name: 'Britannia', slug: 'britannia', isFeatured: true },
  { name: 'Tata', slug: 'tata' },
  { name: 'Nestle', slug: 'nestle' },
  { name: 'Haldiram', slug: 'haldiram' },
  { name: 'Surf Excel', slug: 'surf-excel' },
  { name: 'Pampers', slug: 'pampers' },
  { name: 'Pedigree', slug: 'pedigree' },
];

export const CATALOG_UNIT_SEEDS: CatalogUnitSeed[] = [
  { code: 'piece', name: 'Piece', baseUnit: 'piece', conversionFactor: 1 },
  { code: 'pack', name: 'Pack', baseUnit: 'pack', conversionFactor: 1 },
  { code: 'kg', name: 'Kilogram', baseUnit: 'kg', conversionFactor: 1 },
  { code: 'g', name: 'Gram', baseUnit: 'g', conversionFactor: 1 },
  { code: 'litre', name: 'Litre', baseUnit: 'litre', conversionFactor: 1 },
  { code: 'ml', name: 'Millilitre', baseUnit: 'ml', conversionFactor: 1 },
  { code: 'dozen', name: 'Dozen', baseUnit: 'dozen', conversionFactor: 1 },
];

export const CATALOG_PRODUCT_SEEDS: CatalogProductSeed[] = [
  {
    name: 'Amul Taaza Homogenised Toned Milk',
    slug: 'amul-taaza-milk-1l',
    categorySlug: 'dairy-bread-eggs',
    brandSlug: 'amul',
    productType: 'variant',
    foodType: 'veg',
    shortDescription: '1 litre toned milk',
    searchKeywords: ['milk', 'dairy', 'amul'],
    isFeatured: true,
    variants: [
      {
        sku: 'SEED-AMUL-TAAZA-1L',
        variantName: '1 Litre',
        unit: 'litre',
        unitValue: 1,
        mrp: 6200,
        defaultSellingPrice: 5800,
        isDefault: true,
      },
    ],
  },
  {
    name: 'Britannia Good Day Cashew Cookies',
    slug: 'britannia-good-day-cashew',
    categorySlug: 'packaged-food',
    brandSlug: 'britannia',
    productType: 'variant',
    foodType: 'veg',
    shortDescription: 'Cashew butter cookies',
    searchKeywords: ['cookies', 'biscuit', 'britannia'],
    variants: [
      {
        sku: 'SEED-BRIT-GOODDAY-200G',
        variantName: '200 g',
        unit: 'g',
        unitValue: 200,
        mrp: 4500,
        defaultSellingPrice: 4200,
        isDefault: true,
      },
    ],
  },
  {
    name: 'Tata Salt',
    slug: 'tata-salt-1kg',
    categorySlug: 'masala-dry-fruits',
    brandSlug: 'tata',
    productType: 'variant',
    foodType: 'veg',
    shortDescription: 'Iodised salt 1 kg',
    searchKeywords: ['salt', 'tata', 'masala'],
    variants: [
      {
        sku: 'SEED-TATA-SALT-1KG',
        variantName: '1 kg',
        unit: 'kg',
        unitValue: 1,
        mrp: 2800,
        defaultSellingPrice: 2500,
        isDefault: true,
      },
    ],
  },
  {
    name: 'Fresh Bananas',
    slug: 'fresh-bananas-dozen',
    categorySlug: 'fruits-vegetables',
    brandSlug: 'haldiram',
    productType: 'variant',
    foodType: 'veg',
    shortDescription: 'Fresh bananas per dozen',
    searchKeywords: ['banana', 'fruit', 'fresh'],
    variants: [
      {
        sku: 'SEED-BANANA-DOZEN',
        variantName: '1 Dozen',
        unit: 'dozen',
        unitValue: 1,
        mrp: 6000,
        defaultSellingPrice: 5500,
        isDefault: true,
      },
    ],
  },
  {
    name: 'Surf Excel Matic Front Load',
    slug: 'surf-excel-matic-front-load',
    categorySlug: 'home-care',
    brandSlug: 'surf-excel',
    productType: 'variant',
    foodType: 'not_applicable',
    shortDescription: 'Liquid detergent for front load',
    searchKeywords: ['detergent', 'laundry', 'surf'],
    variants: [
      {
        sku: 'SEED-SURF-MATIC-2L',
        variantName: '2 Litre',
        unit: 'litre',
        unitValue: 2,
        mrp: 39900,
        defaultSellingPrice: 34900,
        isDefault: true,
      },
    ],
  },
  {
    name: 'Coca-Cola Soft Drink',
    slug: 'coca-cola-750ml',
    categorySlug: 'beverages',
    brandSlug: 'nestle',
    productType: 'variant',
    foodType: 'veg',
    shortDescription: 'Carbonated soft drink',
    searchKeywords: ['cola', 'beverage', 'drink'],
    variants: [
      {
        sku: 'SEED-COLA-750ML',
        variantName: '750 ml',
        unit: 'ml',
        unitValue: 750,
        mrp: 4000,
        defaultSellingPrice: 3500,
        isDefault: true,
      },
    ],
  },
  {
    name: 'Basmati Rice Premium',
    slug: 'basmati-rice-premium-5kg',
    categorySlug: 'atta-rice-oil-dals',
    brandSlug: 'tata',
    productType: 'variant',
    foodType: 'veg',
    shortDescription: 'Premium basmati rice',
    searchKeywords: ['rice', 'basmati', 'atta'],
    variants: [
      {
        sku: 'SEED-BASMATI-5KG',
        variantName: '5 kg',
        unit: 'kg',
        unitValue: 5,
        mrp: 89900,
        defaultSellingPrice: 84900,
        isDefault: true,
      },
    ],
  },
  {
    name: 'Haldiram Aloo Bhujia',
    slug: 'haldiram-aloo-bhujia',
    categorySlug: 'packaged-food',
    brandSlug: 'haldiram',
    productType: 'variant',
    foodType: 'veg',
    shortDescription: 'Classic namkeen snack',
    searchKeywords: ['namkeen', 'snack', 'haldiram'],
    variants: [
      {
        sku: 'SEED-HALDIRAM-BHUJIA-400G',
        variantName: '400 g',
        unit: 'g',
        unitValue: 400,
        mrp: 12000,
        defaultSellingPrice: 10900,
        isDefault: true,
      },
    ],
  },
  {
    name: 'Pampers Baby Dry Pants',
    slug: 'pampers-baby-dry-pants',
    categorySlug: 'baby-care',
    brandSlug: 'pampers',
    productType: 'variant',
    foodType: 'not_applicable',
    shortDescription: 'Baby diaper pants pack',
    searchKeywords: ['diaper', 'baby', 'pampers'],
    variants: [
      {
        sku: 'SEED-PAMPERS-M',
        variantName: 'Medium Pack',
        unit: 'pack',
        unitValue: 1,
        mrp: 99900,
        defaultSellingPrice: 94900,
        isDefault: true,
      },
      {
        sku: 'SEED-PAMPERS-L',
        variantName: 'Large Pack',
        unit: 'pack',
        unitValue: 1,
        mrp: 109900,
        defaultSellingPrice: 104900,
      },
    ],
  },
  {
    name: 'Pedigree Adult Chicken & Vegetables',
    slug: 'pedigree-adult-chicken-veg',
    categorySlug: 'pet-care',
    brandSlug: 'pedigree',
    productType: 'variant',
    foodType: 'non_veg',
    shortDescription: 'Dry dog food',
    searchKeywords: ['dog food', 'pet', 'pedigree'],
    variants: [
      {
        sku: 'SEED-PEDIGREE-3KG',
        variantName: '3 kg',
        unit: 'kg',
        unitValue: 3,
        mrp: 129900,
        defaultSellingPrice: 119900,
        isDefault: true,
      },
    ],
  },
  {
    name: 'Fortune Sunflower Oil',
    slug: 'fortune-sunflower-oil-1l',
    categorySlug: 'atta-rice-oil-dals',
    brandSlug: 'tata',
    productType: 'variant',
    foodType: 'veg',
    shortDescription: 'Refined sunflower oil',
    searchKeywords: ['oil', 'cooking', 'sunflower'],
    variants: [
      {
        sku: 'SEED-FORTUNE-OIL-1L',
        variantName: '1 Litre',
        unit: 'litre',
        unitValue: 1,
        mrp: 18500,
        defaultSellingPrice: 16900,
        isDefault: true,
      },
    ],
  },
  {
    name: 'Colgate MaxFresh Toothpaste',
    slug: 'colgate-maxfresh-toothpaste',
    categorySlug: 'personal-care',
    brandSlug: 'nestle',
    productType: 'variant',
    foodType: 'not_applicable',
    shortDescription: 'Cool mint toothpaste',
    searchKeywords: ['toothpaste', 'oral care'],
    variants: [
      {
        sku: 'SEED-COLGATE-150G',
        variantName: '150 g',
        unit: 'g',
        unitValue: 150,
        mrp: 12000,
        defaultSellingPrice: 9900,
        isDefault: true,
      },
    ],
  },
];
