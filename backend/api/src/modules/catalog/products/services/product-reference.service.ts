import { Types } from 'mongoose';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { findBrandById } from '../../brands/repositories/brand.repository';
import { findCategoryById } from '../../categories/repositories/category.repository';
import { PRODUCT_ERROR_CODES, type ProductErrorCode } from '../constants/product-error-codes.constant';

const productError = (code: ProductErrorCode): ErrorCode => ERROR_CODES[code];

const assertCategoryIsValidForProduct = async (categoryId: string) => {
  const category = await findCategoryById(categoryId);

  if (!category) {
    throw new AppError({
      message: 'Category not found or inactive',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: productError(PRODUCT_ERROR_CODES.INVALID_PRODUCT_CATEGORY),
    });
  }

  if (category.status !== 'active' || !category.isVisible || category.isDeleted) {
    throw new AppError({
      message: 'Category must be active and visible',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: productError(PRODUCT_ERROR_CODES.INVALID_PRODUCT_CATEGORY),
    });
  }

  return category;
};

export const validateProductCategoryReferences = async ({
  categoryId,
  subcategoryId,
}: {
  categoryId: string;
  subcategoryId?: string | null;
}) => {
  await assertCategoryIsValidForProduct(categoryId);

  if (!subcategoryId) {
    return;
  }

  if (!Types.ObjectId.isValid(subcategoryId)) {
    throw new AppError({
      message: 'Invalid subcategory',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: productError(PRODUCT_ERROR_CODES.INVALID_PRODUCT_SUBCATEGORY),
    });
  }

  const subcategory = await findCategoryById(subcategoryId);

  if (!subcategory) {
    throw new AppError({
      message: 'Subcategory not found',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: productError(PRODUCT_ERROR_CODES.INVALID_PRODUCT_SUBCATEGORY),
    });
  }

  if (
    subcategory.status !== 'active' ||
    !subcategory.isVisible ||
    subcategory.isDeleted ||
    !subcategory.parentCategoryId
  ) {
    throw new AppError({
      message: 'Subcategory must be an active child category',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: productError(PRODUCT_ERROR_CODES.INVALID_PRODUCT_SUBCATEGORY),
    });
  }

  if (subcategory.parentCategoryId.toString() !== categoryId) {
    throw new AppError({
      message: 'Subcategory does not belong to the selected category',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: productError(PRODUCT_ERROR_CODES.INVALID_PRODUCT_SUBCATEGORY),
    });
  }
};

export const validateProductBrandReference = async (brandId?: string | null) => {
  if (!brandId) {
    return;
  }

  if (!Types.ObjectId.isValid(brandId)) {
    throw new AppError({
      message: 'Invalid brand',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: productError(PRODUCT_ERROR_CODES.INVALID_PRODUCT_BRAND),
    });
  }

  const brand = await findBrandById(brandId);

  if (!brand) {
    throw new AppError({
      message: 'Brand not found',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: productError(PRODUCT_ERROR_CODES.INVALID_PRODUCT_BRAND),
    });
  }

  if (brand.status !== 'active' || !brand.isVisible || brand.isDeleted) {
    throw new AppError({
      message: 'Brand must be active and visible',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: productError(PRODUCT_ERROR_CODES.INVALID_PRODUCT_BRAND),
    });
  }
};
