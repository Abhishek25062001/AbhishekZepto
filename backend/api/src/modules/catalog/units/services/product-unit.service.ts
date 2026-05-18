import { Types } from 'mongoose';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES, type ErrorCode } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import { writeAuditLog } from '../../../audit';
import { PRODUCT_UNIT_AUDIT_EVENTS } from '../constants/product-unit-audit-events.constant';
import {
  PRODUCT_UNIT_ERROR_CODES,
  type ProductUnitErrorCode,
} from '../constants/product-unit-error-codes.constant';
import {
  createProductUnit as createProductUnitRecord,
  findProductUnitByCode,
  findProductUnitById,
  listProductUnits as listProductUnitsRecord,
  softDeleteProductUnitById,
  updateProductUnitById,
} from '../repositories/product-unit.repository';
import type {
  CreateProductUnitInput,
  ProductUnitListQuery,
  UpdateProductUnitInput,
} from '../types/product-unit.types';
import { countVariantsUsingUnit } from '../../variants/repositories/product-variant.repository';
import { normalizeProductUnitCode } from '../utils/product-unit-code.util';
import { toProductUnitResponse } from '../utils/product-unit-response.mapper';

const unitError = (code: ProductUnitErrorCode): ErrorCode => ERROR_CODES[code];

const assertValidConversionFactor = (value: number): void => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new AppError({
      message: 'Conversion factor must be greater than zero',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: unitError(PRODUCT_UNIT_ERROR_CODES.INVALID_CONVERSION_FACTOR),
    });
  }
};

const resolveCodeForCreate = async (code: string): Promise<string> => {
  const resolvedCode = normalizeProductUnitCode(code);

  if (!resolvedCode) {
    throw new AppError({
      message: 'Product unit code is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findProductUnitByCode(resolvedCode);

  if (existing) {
    throw new AppError({
      message: 'Product unit code already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: unitError(PRODUCT_UNIT_ERROR_CODES.PRODUCT_UNIT_CODE_ALREADY_EXISTS),
    });
  }

  return resolvedCode;
};

const resolveCodeForUpdate = async (
  unitId: string,
  currentCode: string,
  code?: string,
): Promise<string> => {
  if (!code) {
    return currentCode;
  }

  const resolvedCode = normalizeProductUnitCode(code);

  if (!resolvedCode) {
    throw new AppError({
      message: 'Product unit code is required',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorCode: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const existing = await findProductUnitByCode(resolvedCode, unitId);

  if (existing) {
    throw new AppError({
      message: 'Product unit code already exists',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: unitError(PRODUCT_UNIT_ERROR_CODES.PRODUCT_UNIT_CODE_ALREADY_EXISTS),
    });
  }

  return resolvedCode;
};

export const listProductUnits = async (query: ProductUnitListQuery) => {
  const response = await listProductUnitsRecord(query);

  return {
    items: response.items.map(toProductUnitResponse),
    pagination: {
      page: query.page,
      limit: query.limit,
      total: response.total,
      totalPages: Math.max(1, Math.ceil(response.total / query.limit)),
      hasNextPage: query.page * query.limit < response.total,
      hasPreviousPage: query.page > 1,
    },
  };
};

export const getProductUnitById = async (unitId: string) => {
  const unit = await findProductUnitById(unitId);

  if (!unit) {
    throw new AppError({
      message: 'Product unit not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: unitError(PRODUCT_UNIT_ERROR_CODES.PRODUCT_UNIT_NOT_FOUND),
    });
  }

  return toProductUnitResponse(unit);
};

export const createProductUnit = async (
  input: CreateProductUnitInput,
  actorUserId: string,
) => {
  assertValidConversionFactor(input.conversionFactor);
  const code = await resolveCodeForCreate(input.code);
  const actorId = Types.ObjectId.isValid(actorUserId) ? new Types.ObjectId(actorUserId) : null;

  const created = await createProductUnitRecord({
    code,
    name: input.name.trim(),
    baseUnit: input.baseUnit,
    conversionFactor: input.conversionFactor,
    status: input.status ?? 'active',
    createdBy: actorId,
    updatedBy: actorId,
  });

  await writeAuditLog({
    eventType: PRODUCT_UNIT_AUDIT_EVENTS.UNIT_CREATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'product_unit',
    entityId: created._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      unitId: created._id.toString(),
      code: created.code,
    },
    status: 'success',
  });

  return toProductUnitResponse(created);
};

export const updateProductUnit = async (
  unitId: string,
  input: UpdateProductUnitInput,
  actorUserId: string,
) => {
  const existing = await findProductUnitById(unitId);

  if (!existing) {
    throw new AppError({
      message: 'Product unit not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: unitError(PRODUCT_UNIT_ERROR_CODES.PRODUCT_UNIT_NOT_FOUND),
    });
  }

  if (input.conversionFactor !== undefined) {
    assertValidConversionFactor(input.conversionFactor);
  }

  const code = await resolveCodeForUpdate(unitId, existing.code, input.code);
  const actorId = Types.ObjectId.isValid(actorUserId) ? new Types.ObjectId(actorUserId) : null;

  const updated = await updateProductUnitById(unitId, {
    ...(input.code !== undefined ? { code } : {}),
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    ...(input.baseUnit !== undefined ? { baseUnit: input.baseUnit } : {}),
    ...(input.conversionFactor !== undefined
      ? { conversionFactor: input.conversionFactor }
      : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    updatedBy: actorId,
  });

  if (!updated) {
    throw new AppError({
      message: 'Product unit not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: unitError(PRODUCT_UNIT_ERROR_CODES.PRODUCT_UNIT_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: PRODUCT_UNIT_AUDIT_EVENTS.UNIT_UPDATED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'product_unit',
    entityId: updated._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      unitId: updated._id.toString(),
    },
    status: 'success',
  });

  return toProductUnitResponse(updated);
};

export const deleteProductUnit = async (unitId: string, actorUserId: string) => {
  const existing = await findProductUnitById(unitId);

  if (!existing) {
    throw new AppError({
      message: 'Product unit not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: unitError(PRODUCT_UNIT_ERROR_CODES.PRODUCT_UNIT_NOT_FOUND),
    });
  }

  const variantCount = await countVariantsUsingUnit(existing.code);

  if (variantCount > 0) {
    throw new AppError({
      message: 'Product unit is in use and cannot be deleted',
      statusCode: HTTP_STATUS.CONFLICT,
      errorCode: unitError(PRODUCT_UNIT_ERROR_CODES.PRODUCT_UNIT_IN_USE),
    });
  }

  const actorId = Types.ObjectId.isValid(actorUserId) ? new Types.ObjectId(actorUserId) : null;

  const deleted = await softDeleteProductUnitById(unitId, actorId);

  if (!deleted) {
    throw new AppError({
      message: 'Product unit not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: unitError(PRODUCT_UNIT_ERROR_CODES.PRODUCT_UNIT_NOT_FOUND),
    });
  }

  await writeAuditLog({
    eventType: PRODUCT_UNIT_AUDIT_EVENTS.UNIT_DELETED,
    actorId,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'product_unit',
    entityId: deleted._id,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: null,
    traceId: null,
    ipAddress: null,
    userAgent: null,
    metadata: {
      unitId: deleted._id.toString(),
    },
    status: 'success',
  });

  return toProductUnitResponse(deleted);
};
