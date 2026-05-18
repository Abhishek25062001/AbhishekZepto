const ERROR_MESSAGES: Record<string, string> = {
  CATEGORY_NOT_FOUND: 'Category not found.',
  CATEGORY_SLUG_ALREADY_EXISTS: 'A category with this slug already exists.',
  CATEGORY_HAS_CHILDREN: 'Cannot delete a category that has subcategories.',
  CATEGORY_HAS_ACTIVE_PRODUCTS: 'Cannot delete a category linked to active products.',
  INVALID_PARENT_CATEGORY: 'Invalid parent category selected.',
  CATEGORY_LEVEL_LIMIT_EXCEEDED: 'Category nesting cannot exceed two levels.',
  BRAND_NOT_FOUND: 'Brand not found.',
  BRAND_SLUG_ALREADY_EXISTS: 'A brand with this slug already exists.',
  BRAND_HAS_ACTIVE_PRODUCTS: 'Cannot delete a brand linked to active products.',
  INVALID_BRAND_STATUS: 'Invalid brand status.',
  PRODUCT_UNIT_NOT_FOUND: 'Product unit not found.',
  PRODUCT_UNIT_CODE_ALREADY_EXISTS: 'A unit with this code already exists.',
  PRODUCT_UNIT_IN_USE: 'This unit is in use and cannot be deleted.',
  INVALID_CONVERSION_FACTOR: 'Conversion factor must be greater than zero.',
  PRODUCT_NOT_FOUND: 'Product not found.',
  PRODUCT_SLUG_ALREADY_EXISTS: 'A product with this slug already exists.',
  INVALID_PRODUCT_CATEGORY: 'Invalid category selected.',
  INVALID_PRODUCT_SUBCATEGORY: 'Invalid subcategory selected.',
  INVALID_PRODUCT_BRAND: 'Invalid brand selected.',
  PRODUCT_HAS_ACTIVE_VARIANTS: 'Cannot delete a product with active variants.',
  REJECTION_REASON_REQUIRED: 'Rejection reason is required.',
  MEDIA_INVALID_MIME_TYPE: 'File type is not allowed.',
  MEDIA_FILE_TOO_LARGE: 'File is too large.',
  MEDIA_UPLOAD_FAILED: 'Upload failed. Please try again.',
  MEDIA_FILE_EMPTY: 'Selected file is empty.',
};

export const mapCatalogErrorCodeToMessage = (errorCode: string | undefined, fallback: string) => {
  if (!errorCode) {
    return fallback;
  }
  const normalized = errorCode.includes('.') ? errorCode.split('.').pop() ?? errorCode : errorCode;
  return ERROR_MESSAGES[normalized] ?? fallback;
};

export const extractApiErrorCode = (error: unknown): string | undefined => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined;
  }
  const response = (error as { response?: { data?: { error?: { code?: string } } } }).response;
  return response?.data?.error?.code;
};
