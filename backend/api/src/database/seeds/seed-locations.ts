import { findCityBySlug, createCity } from '../../modules/locations/cities/repositories/city.repository';
import {
  findServiceAreaByCityAndSlug,
  createServiceArea,
} from '../../modules/locations/service-areas/repositories/service-area.repository';

const DELHI_SLUG = 'delhi';
const DWARKA_SLUG = 'dwarka';

export const seedLocations = async (dryRun: boolean): Promise<void> => {
  if (dryRun) {
    console.log('Dry run: would upsert city', DELHI_SLUG);
    console.log('Dry run: would upsert service area', DWARKA_SLUG, 'for city', DELHI_SLUG);
    return;
  }

  let city = await findCityBySlug(DELHI_SLUG);

  if (!city) {
    city = await createCity({
      name: 'Delhi',
      slug: DELHI_SLUG,
      state: 'Delhi',
      country: 'India',
      timezone: 'Asia/Kolkata',
      currencyCode: 'INR',
      latitude: 28.6139,
      longitude: 77.209,
      serviceRadiusKm: 25,
      isServiceable: true,
      status: 'active',
    });
    console.log('Seeded city:', city.slug);
  } else {
    console.log('City already exists:', city.slug);
  }

  const existingArea = await findServiceAreaByCityAndSlug(city._id.toString(), DWARKA_SLUG);

  if (!existingArea) {
    const serviceArea = await createServiceArea({
      cityId: city._id,
      name: 'Dwarka',
      slug: DWARKA_SLUG,
      description: 'Dwarka service area',
      isServiceable: true,
      status: 'active',
    });
    console.log('Seeded service area:', serviceArea.slug);
  } else {
    console.log('Service area already exists:', existingArea.slug);
  }
};
