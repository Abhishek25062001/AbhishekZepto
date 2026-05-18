import type { Types } from 'mongoose';
import type { BrandRecord } from '../models/brand.model';
import type { BrandResponse } from '../types/brand.types';
import type { BrandStatus } from '../constants/brand-status.constant';

type BrandLean = BrandRecord & { _id: Types.ObjectId };

export const toBrandResponse = (brand: BrandLean): BrandResponse => ({
  id: brand._id.toString(),
  name: brand.name,
  slug: brand.slug,
  description: brand.description,
  logoUrl: brand.logoUrl,
  bannerUrl: brand.bannerUrl,
  isFeatured: brand.isFeatured,
  isVisible: brand.isVisible,
  status: brand.status as BrandStatus,
  createdAt: brand.createdAt,
  updatedAt: brand.updatedAt,
});
