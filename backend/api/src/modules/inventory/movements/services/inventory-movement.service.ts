import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { HTTP_STATUS } from '../../../../utils/http-status';
import type { VendorInventoryScope } from '../../types/inventory-stock.types';
import { createInventoryMovement as createInventoryMovementRecord } from '../repositories/inventory-movement.repository';
import { findInventoryMovementById, listInventoryMovements as listInventoryMovementsRecord } from '../repositories/inventory-movement.repository';
import type { CreateInventoryMovementInput, InventoryMovementListQuery } from '../types/inventory-movement.types';
import { toInventoryMovementResponse } from '../utils/inventory-movement-response.mapper';
import { Types } from 'mongoose';

const toObjectIdOrNull = (value: string | null | undefined): Types.ObjectId | null =>
  value && Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

export const createInventoryMovement = async (input: CreateInventoryMovementInput) => {
  const created = await createInventoryMovementRecord({
    storeId: new Types.ObjectId(input.storeId),
    vendorId: new Types.ObjectId(input.vendorId),
    cityId: new Types.ObjectId(input.cityId),
    inventoryStockId: new Types.ObjectId(input.inventoryStockId),
    storeProductId: new Types.ObjectId(input.storeProductId),
    productId: new Types.ObjectId(input.productId),
    variantId: new Types.ObjectId(input.variantId),
    movementType: input.movementType,
    quantity: input.quantity,
    previousAvailableQuantity: input.previousAvailableQuantity,
    newAvailableQuantity: input.newAvailableQuantity,
    previousReservedQuantity: input.previousReservedQuantity,
    newReservedQuantity: input.newReservedQuantity,
    previousTotalQuantity: input.previousTotalQuantity,
    newTotalQuantity: input.newTotalQuantity,
    reason: input.reason,
    referenceType: input.referenceType,
    referenceId: input.referenceId ?? null,
    notes: input.notes ?? null,
    metadata: input.metadata ?? null,
    createdBy: toObjectIdOrNull(input.createdBy),
  });

  return toInventoryMovementResponse(created);
};

export const getInventoryMovementById = async (movementId: string) => {
  const movement = await findInventoryMovementById(movementId);

  if (!movement) {
    throw new AppError({
      message: 'Inventory movement not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.NOT_FOUND,
    });
  }

  return toInventoryMovementResponse(movement);
};

export const listInventoryMovements = async (
  query: InventoryMovementListQuery,
  vendorScope?: VendorInventoryScope,
) => {
  const scopedQuery = { ...query };

  if (vendorScope?.vendorId) {
    scopedQuery.vendorId = vendorScope.vendorId;
  }
  if (vendorScope?.storeId) {
    scopedQuery.storeId = vendorScope.storeId;
  }

  const response = await listInventoryMovementsRecord(scopedQuery);

  return {
    items: response.items.map(toInventoryMovementResponse),
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
