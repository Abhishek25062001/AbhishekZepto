import type { MediaFilePurpose } from '../constants/media-file-purpose.constant';
import type { MediaOwnerType } from '../constants/media-owner-type.constant';

const purposeFolderMap: Partial<Record<MediaFilePurpose, string>> = {
  category_icon: 'catalog/categories',
  category_banner: 'catalog/categories',
  brand_logo: 'catalog/brands',
  brand_banner: 'catalog/brands',
  product_main_image: 'catalog/products',
  product_gallery_image: 'catalog/products',
  variant_image: 'catalog/variants',
  store_logo: 'stores',
  store_banner: 'stores',
  profile_image: 'users',
  order_proof: 'orders',
  support_attachment: 'support',
  document_upload: 'general',
  general: 'general',
};

const ownerFolderMap: Partial<Record<MediaOwnerType, string>> = {
  category: 'catalog/categories',
  brand: 'catalog/brands',
  product: 'catalog/products',
  product_variant: 'catalog/variants',
  store: 'stores',
  user: 'users',
  order: 'orders',
  support_ticket: 'support',
  system: 'general',
};

export const buildStorageKey = (
  filePurpose: MediaFilePurpose,
  ownerType: MediaOwnerType | null | undefined,
  ownerId: string | null | undefined,
  storedFileName: string,
): string => {
  const baseFolder =
    purposeFolderMap[filePurpose] ??
    (ownerType ? ownerFolderMap[ownerType] : undefined) ??
    'general';
  const ownerSegment = ownerId ? `${ownerId}/` : '';
  return `${baseFolder}/${ownerSegment}${storedFileName}`.replace(/\/+/g, '/');
};
