import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { PRODUCT_APPROVAL_STATUS } from '../constants/product-approval-status.constant';
import { PRODUCT_ERROR_CODES } from '../constants/product-error-codes.constant';
import type { ProductRecord } from '../models/product.model';
import * as auditLogServiceModule from '../../../audit/services/audit-log.service';
import * as productRepositoryModule from '../repositories/product.repository';
import * as variantRepositoryModule from '../../variants/repositories/product-variant.repository';
import * as storeProductRepositoryModule from '../../../store-products/repositories/store-product.repository';
import * as productReferenceModule from './product-reference.service';
import {
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
  updateProductApprovalStatus,
} from './product.service';

type ProductRepositoryModule = {
  findProductById: (id: string) => Promise<(ProductRecord & { _id: Types.ObjectId }) | null>;
  findProductBySlug: (slug: string, excludeId?: string) => Promise<(ProductRecord & { _id: Types.ObjectId }) | null>;
  createProduct: (payload: Partial<ProductRecord>) => Promise<ProductRecord & { _id: Types.ObjectId }>;
  updateProductById: (
    id: string,
    payload: Partial<ProductRecord>,
  ) => Promise<(ProductRecord & { _id: Types.ObjectId }) | null>;
  softDeleteProductById: (
    id: string,
    updatedBy: Types.ObjectId | null,
  ) => Promise<(ProductRecord & { _id: Types.ObjectId }) | null>;
};

const productRepository = productRepositoryModule as unknown as ProductRepositoryModule;
const variantRepository = variantRepositoryModule as unknown as {
  countActiveVariantsByProduct: (productId: string) => Promise<number>;
};
const storeProductRepository = storeProductRepositoryModule as unknown as {
  countStoreProductsByProduct: (productId: string) => Promise<number>;
};
const productReference = productReferenceModule as unknown as {
  validateProductCategoryReferences: (...args: unknown[]) => Promise<void>;
  validateProductBrandReference: (...args: unknown[]) => Promise<void>;
};
const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};

const noopAuditLog = async () => undefined;

const originalRepository: ProductRepositoryModule = {
  findProductById: productRepository.findProductById,
  findProductBySlug: productRepository.findProductBySlug,
  createProduct: productRepository.createProduct,
  updateProductById: productRepository.updateProductById,
  softDeleteProductById: productRepository.softDeleteProductById,
};

const originalReference = {
  validateProductCategoryReferences: productReference.validateProductCategoryReferences,
  validateProductBrandReference: productReference.validateProductBrandReference,
};

const productId = new Types.ObjectId();
const categoryId = new Types.ObjectId();
const actorId = new Types.ObjectId().toString();

const buildProduct = (
  overrides: Partial<ProductRecord & { _id: Types.ObjectId }> = {},
): ProductRecord & { _id: Types.ObjectId } => ({
  _id: productId,
  name: 'Milk',
  slug: 'milk',
  description: null,
  shortDescription: null,
  categoryId,
  subcategoryId: null,
  brandId: null,
  productType: 'simple',
  foodType: 'veg',
  taxCategoryId: null,
  hsnCode: null,
  searchKeywords: [],
  tags: [],
  defaultImageUrl: null,
  imageUrls: [],
  attributeSummary: null,
  isFeatured: false,
  isVisible: true,
  approvalStatus: 'draft',
  status: 'active',
  approvedBy: null,
  approvedAt: null,
  rejectedBy: null,
  rejectedAt: null,
  rejectionReason: null,
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});

const isAppErrorWithCode = (error: unknown, code: string) =>
  error instanceof AppError && error.errorCode === code;

beforeEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
  productReference.validateProductCategoryReferences = async () => undefined;
  productReference.validateProductBrandReference = async () => undefined;
  variantRepository.countActiveVariantsByProduct = async () => 0;
  storeProductRepository.countStoreProductsByProduct = async () => 0;
});

// store product delete guard uses inventory count — mocked in store-product tests

afterEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
  productRepository.findProductById = originalRepository.findProductById;
  productRepository.findProductBySlug = originalRepository.findProductBySlug;
  productRepository.createProduct = originalRepository.createProduct;
  productRepository.updateProductById = originalRepository.updateProductById;
  productRepository.softDeleteProductById = originalRepository.softDeleteProductById;
  productReference.validateProductCategoryReferences =
    originalReference.validateProductCategoryReferences;
  productReference.validateProductBrandReference = originalReference.validateProductBrandReference;
});

test('createProduct creates product with generated slug', async () => {
  productRepository.findProductBySlug = async () => null;
  productRepository.createProduct = async (payload) =>
    buildProduct({ ...payload, _id: productId });

  const created = await createProduct(
    {
      name: 'Milk',
      categoryId: categoryId.toString(),
      productType: 'simple',
    },
    actorId,
  );

  assert.equal(created.slug, 'milk');
  assert.equal(created.approvalStatus, 'draft');
});

test('createProduct rejects duplicate slug', async () => {
  productRepository.findProductBySlug = async () => buildProduct();

  await assert.rejects(
    () =>
      createProduct(
        {
          name: 'Milk',
          slug: 'milk',
          categoryId: categoryId.toString(),
          productType: 'simple',
        },
        actorId,
      ),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[PRODUCT_ERROR_CODES.PRODUCT_SLUG_ALREADY_EXISTS]),
  );
});

test('getProductById returns not found', async () => {
  productRepository.findProductById = async () => null;

  await assert.rejects(
    () => getProductById(productId.toString()),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND]),
  );
});

test('updateProduct resets approval on critical field change', async () => {
  const existing = buildProduct({ approvalStatus: 'approved', approvedAt: new Date() });
  productRepository.findProductById = async () => existing;
  productRepository.findProductBySlug = async () => null;
  productRepository.updateProductById = async (_id, payload) =>
    buildProduct({
      ...existing,
      ...payload,
      approvalStatus: PRODUCT_APPROVAL_STATUS.PENDING_REVIEW,
    });

  const updated = await updateProduct(
    productId.toString(),
    { name: 'Organic Milk' },
    actorId,
  );

  assert.equal(updated.approvalStatus, 'pending_review');
});

test('updateProductApprovalStatus approves product', async () => {
  productRepository.findProductById = async () => buildProduct();
  productRepository.updateProductById = async (_id, payload) =>
    buildProduct({
      ...payload,
      approvalStatus: 'approved',
    });

  const updated = await updateProductApprovalStatus(
    productId.toString(),
    { approvalStatus: 'approved' },
    actorId,
  );

  assert.equal(updated.approvalStatus, 'approved');
});

test('updateProductApprovalStatus rejects without reason', async () => {
  productRepository.findProductById = async () => buildProduct();

  await assert.rejects(
    () =>
      updateProductApprovalStatus(
        productId.toString(),
        { approvalStatus: 'rejected' },
        actorId,
      ),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[PRODUCT_ERROR_CODES.REJECTION_REASON_REQUIRED]),
  );
});

test('deleteProduct soft deletes product', async () => {
  productRepository.findProductById = async () => buildProduct();
  productRepository.softDeleteProductById = async () =>
    buildProduct({ isDeleted: true, status: 'archived', approvalStatus: 'archived' });

  const deleted = await deleteProduct(productId.toString(), actorId);
  assert.equal(deleted.slug, 'milk');
});
