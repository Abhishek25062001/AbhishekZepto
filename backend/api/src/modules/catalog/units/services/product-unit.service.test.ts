import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { afterEach, beforeEach, test } from 'node:test';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { PRODUCT_UNIT_ERROR_CODES } from '../constants/product-unit-error-codes.constant';
import type { ProductUnitRecord } from '../models/product-unit.model';
import * as auditLogServiceModule from '../../../audit/services/audit-log.service';
import * as productUnitRepositoryModule from '../repositories/product-unit.repository';
import * as variantRepositoryModule from '../../variants/repositories/product-variant.repository';
import {
  createProductUnit,
  deleteProductUnit,
  getProductUnitById,
  updateProductUnit,
} from './product-unit.service';

type ProductUnitRepositoryModule = {
  findProductUnitById: (
    unitId: string,
  ) => Promise<(ProductUnitRecord & { _id: Types.ObjectId }) | null>;
  findProductUnitByCode: (
    code: string,
    excludeId?: string,
  ) => Promise<(ProductUnitRecord & { _id: Types.ObjectId }) | null>;
  createProductUnit: (
    payload: Partial<ProductUnitRecord>,
  ) => Promise<ProductUnitRecord & { _id: Types.ObjectId }>;
  updateProductUnitById: (
    unitId: string,
    payload: Partial<ProductUnitRecord>,
  ) => Promise<(ProductUnitRecord & { _id: Types.ObjectId }) | null>;
  softDeleteProductUnitById: (
    unitId: string,
    updatedBy: Types.ObjectId | null,
  ) => Promise<(ProductUnitRecord & { _id: Types.ObjectId }) | null>;
};

const productUnitRepository =
  productUnitRepositoryModule as unknown as ProductUnitRepositoryModule;
const variantRepository = variantRepositoryModule as unknown as {
  countVariantsUsingUnit: (unitCode: string) => Promise<number>;
};
const auditLogService = auditLogServiceModule as unknown as {
  writeAuditLog: typeof auditLogServiceModule.writeAuditLog;
};
const noopAuditLog = async () => undefined;

const originalRepository: ProductUnitRepositoryModule = {
  findProductUnitById: productUnitRepository.findProductUnitById,
  findProductUnitByCode: productUnitRepository.findProductUnitByCode,
  createProductUnit: productUnitRepository.createProductUnit,
  updateProductUnitById: productUnitRepository.updateProductUnitById,
  softDeleteProductUnitById: productUnitRepository.softDeleteProductUnitById,
};

const unitId = new Types.ObjectId();
const actorId = new Types.ObjectId().toString();

const buildUnit = (
  overrides: Partial<ProductUnitRecord & { _id: Types.ObjectId }> = {},
): ProductUnitRecord & { _id: Types.ObjectId } => ({
  _id: unitId,
  code: 'kg',
  name: 'Kilogram',
  baseUnit: 'kg',
  conversionFactor: 1,
  status: 'active',
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
  variantRepository.countVariantsUsingUnit = async () => 0;
});

afterEach(() => {
  auditLogService.writeAuditLog = noopAuditLog;
  productUnitRepository.findProductUnitById = originalRepository.findProductUnitById;
  productUnitRepository.findProductUnitByCode = originalRepository.findProductUnitByCode;
  productUnitRepository.createProductUnit = originalRepository.createProductUnit;
  productUnitRepository.updateProductUnitById = originalRepository.updateProductUnitById;
  productUnitRepository.softDeleteProductUnitById = originalRepository.softDeleteProductUnitById;
});

test('createProductUnit succeeds with required fields', async () => {
  productUnitRepository.findProductUnitByCode = async () => null;
  productUnitRepository.createProductUnit = async (payload) =>
    buildUnit({ ...payload, _id: unitId });

  const created = await createProductUnit(
    {
      code: 'KG',
      name: 'Kilogram',
      baseUnit: 'kg',
      conversionFactor: 1,
    },
    actorId,
  );

  assert.equal(created.code, 'kg');
});

test('createProductUnit rejects duplicate code', async () => {
  productUnitRepository.findProductUnitByCode = async () => buildUnit();

  await assert.rejects(
    () =>
      createProductUnit(
        {
          code: 'kg',
          name: 'Kilogram',
          baseUnit: 'kg',
          conversionFactor: 1,
        },
        actorId,
      ),
    (error: unknown) =>
      isAppErrorWithCode(
        error,
        ERROR_CODES[PRODUCT_UNIT_ERROR_CODES.PRODUCT_UNIT_CODE_ALREADY_EXISTS],
      ),
  );
});

test('createProductUnit rejects invalid conversion factor', async () => {
  await assert.rejects(
    () =>
      createProductUnit(
        {
          code: 'kg',
          name: 'Kilogram',
          baseUnit: 'kg',
          conversionFactor: 0,
        },
        actorId,
      ),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[PRODUCT_UNIT_ERROR_CODES.INVALID_CONVERSION_FACTOR]),
  );
});

test('getProductUnitById returns not found', async () => {
  productUnitRepository.findProductUnitById = async () => null;

  await assert.rejects(
    () => getProductUnitById(unitId.toString()),
    (error: unknown) =>
      isAppErrorWithCode(error, ERROR_CODES[PRODUCT_UNIT_ERROR_CODES.PRODUCT_UNIT_NOT_FOUND]),
  );
});

test('updateProductUnit updates fields', async () => {
  const existing = buildUnit();
  productUnitRepository.findProductUnitById = async () => existing;
  productUnitRepository.findProductUnitByCode = async () => null;
  productUnitRepository.updateProductUnitById = async (_id, payload) =>
    buildUnit({ ...existing, ...payload, name: 'Kilogram Updated' });

  const updated = await updateProductUnit(
    unitId.toString(),
    { name: 'Kilogram Updated' },
    actorId,
  );

  assert.equal(updated.name, 'Kilogram Updated');
});

test('deleteProductUnit soft deletes unit', async () => {
  productUnitRepository.findProductUnitById = async () => buildUnit();
  productUnitRepository.softDeleteProductUnitById = async () =>
    buildUnit({ isDeleted: true, status: 'archived' });

  const deleted = await deleteProductUnit(unitId.toString(), actorId);
  assert.equal(deleted.code, 'kg');
});
