import { seedBrands } from './seed-brands';
import { seedCategories } from './seed-categories';
import { seedProductVariants } from './seed-product-variants';
import { seedProducts } from './seed-products';
import { seedUnits } from './seed-units';

export const seedCatalog = async (dryRun: boolean): Promise<void> => {
  const categoryIds = await seedCategories(dryRun);
  const brandIds = await seedBrands(dryRun);
  await seedUnits(dryRun);
  const productIds = await seedProducts(dryRun, categoryIds, brandIds);
  await seedProductVariants(dryRun, productIds);

  if (dryRun) {
    console.log('Dry run: catalog master seed completed');
    return;
  }

  console.log('Catalog master seed completed');
};
