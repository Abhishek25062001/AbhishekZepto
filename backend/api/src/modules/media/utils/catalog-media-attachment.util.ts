import { MEDIA_FILE_PURPOSE } from '../constants/media-file-purpose.constant';
import { MEDIA_OWNER_TYPE } from '../constants/media-owner-type.constant';
import { attachMediaOwner, getMediaFileById } from '../services/media-file.service';

type CatalogMediaActor = {
  userId: string;
  role?: string | null;
};

const actorFromUserId = (actorUserId: string): CatalogMediaActor => ({
  userId: actorUserId,
  role: null,
});

export const resolveMediaPublicUrl = async (mediaFileId: string): Promise<string | null> => {
  const media = await getMediaFileById(mediaFileId);
  return media.publicUrl;
};

export const attachCategoryMedia = async (
  categoryId: string,
  input: { iconMediaFileId?: string; bannerMediaFileId?: string },
  actorUserId: string,
): Promise<{ iconUrl?: string | null; bannerUrl?: string | null }> => {
  const actor = actorFromUserId(actorUserId);
  const result: { iconUrl?: string | null; bannerUrl?: string | null } = {};

  if (input.iconMediaFileId) {
    const media = await attachMediaOwner(
      {
        mediaFileId: input.iconMediaFileId,
        ownerType: MEDIA_OWNER_TYPE.CATEGORY,
        ownerId: categoryId,
        filePurpose: MEDIA_FILE_PURPOSE.CATEGORY_ICON,
      },
      { ...actor, surface: 'admin_dashboard' },
    );
    result.iconUrl = media.publicUrl;
  }

  if (input.bannerMediaFileId) {
    const media = await attachMediaOwner(
      {
        mediaFileId: input.bannerMediaFileId,
        ownerType: MEDIA_OWNER_TYPE.CATEGORY,
        ownerId: categoryId,
        filePurpose: MEDIA_FILE_PURPOSE.CATEGORY_BANNER,
      },
      { ...actor, surface: 'admin_dashboard' },
    );
    result.bannerUrl = media.publicUrl;
  }

  return result;
};

export const attachBrandMedia = async (
  brandId: string,
  input: { logoMediaFileId?: string; bannerMediaFileId?: string },
  actorUserId: string,
): Promise<{ logoUrl?: string | null; bannerUrl?: string | null }> => {
  const actor = actorFromUserId(actorUserId);
  const result: { logoUrl?: string | null; bannerUrl?: string | null } = {};

  if (input.logoMediaFileId) {
    const media = await attachMediaOwner(
      {
        mediaFileId: input.logoMediaFileId,
        ownerType: MEDIA_OWNER_TYPE.BRAND,
        ownerId: brandId,
        filePurpose: MEDIA_FILE_PURPOSE.BRAND_LOGO,
      },
      { ...actor, surface: 'admin_dashboard' },
    );
    result.logoUrl = media.publicUrl;
  }

  if (input.bannerMediaFileId) {
    const media = await attachMediaOwner(
      {
        mediaFileId: input.bannerMediaFileId,
        ownerType: MEDIA_OWNER_TYPE.BRAND,
        ownerId: brandId,
        filePurpose: MEDIA_FILE_PURPOSE.BRAND_BANNER,
      },
      { ...actor, surface: 'admin_dashboard' },
    );
    result.bannerUrl = media.publicUrl;
  }

  return result;
};

export const attachProductMedia = async (
  productId: string,
  input: { defaultImageMediaFileId?: string },
  actorUserId: string,
): Promise<{ defaultImageUrl?: string | null }> => {
  if (!input.defaultImageMediaFileId) {
    return {};
  }

  const media = await attachMediaOwner(
    {
      mediaFileId: input.defaultImageMediaFileId,
      ownerType: MEDIA_OWNER_TYPE.PRODUCT,
      ownerId: productId,
      filePurpose: MEDIA_FILE_PURPOSE.PRODUCT_MAIN_IMAGE,
    },
    { userId: actorUserId, role: null, surface: 'admin_dashboard' },
  );

  return { defaultImageUrl: media.publicUrl };
};

export const attachVariantMedia = async (
  variantId: string,
  input: { imageMediaFileId?: string },
  actorUserId: string,
): Promise<{ imageUrl?: string | null }> => {
  if (!input.imageMediaFileId) {
    return {};
  }

  const media = await attachMediaOwner(
    {
      mediaFileId: input.imageMediaFileId,
      ownerType: MEDIA_OWNER_TYPE.PRODUCT_VARIANT,
      ownerId: variantId,
      filePurpose: MEDIA_FILE_PURPOSE.VARIANT_IMAGE,
    },
    { userId: actorUserId, role: null, surface: 'admin_dashboard' },
  );

  return { imageUrl: media.publicUrl };
};
