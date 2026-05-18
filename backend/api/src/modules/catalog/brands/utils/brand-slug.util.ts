export const generateBrandSlug = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const normalizeBrandSlug = (slug: string): string => {
  return generateBrandSlug(slug);
};
