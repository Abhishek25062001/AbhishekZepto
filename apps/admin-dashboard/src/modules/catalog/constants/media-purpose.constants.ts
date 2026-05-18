export const MEDIA_FILE_PURPOSE = {
  CATEGORY_ICON: 'category_icon',
  CATEGORY_BANNER: 'category_banner',
  BRAND_LOGO: 'brand_logo',
  BRAND_BANNER: 'brand_banner',
  PRODUCT_MAIN_IMAGE: 'product_main_image',
  PRODUCT_GALLERY_IMAGE: 'product_gallery_image',
} as const;

export type MediaFilePurpose = (typeof MEDIA_FILE_PURPOSE)[keyof typeof MEDIA_FILE_PURPOSE];
