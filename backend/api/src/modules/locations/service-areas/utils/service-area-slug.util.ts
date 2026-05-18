export const generateServiceAreaSlug = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const normalizeServiceAreaSlug = (slug: string): string => {
  return generateServiceAreaSlug(slug);
};
