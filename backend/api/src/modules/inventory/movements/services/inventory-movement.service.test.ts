import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { beforeEach, test } from 'node:test';
import { AppError } from '../../../../errors/AppError';
import { ERROR_CODES } from '../../../../errors/error-codes';
import { INVENTORY_MOVEMENT_TYPE } from '../constants/inventory-movement-type.constant';
import { INVENTORY_REFERENCE_TYPE } from '../constants/inventory-reference-type.constant';
import type { InventoryMovementRecord } from '../models/inventory-movement.model';
import * as movementRepositoryModule from '../repositories/inventory-movement.repository';
import { getInventoryMovementById, listInventoryMovements } from './inventory-movement.service';

const movementRepository = movementRepositoryModule as unknown as {
  findInventoryMovementById: (id: string) => Promise<(InventoryMovementRecord & { _id: Types.ObjectId }) | null>;
  listInventoryMovements: (
    query: unknown,
  ) => Promise<{ items: (InventoryMovementRecord & { _id: Types.ObjectId })[]; total: number }>;
  createInventoryMovement: (
    payload: Partial<InventoryMovementRecord>,
  ) => Promise<InventoryMovementRecord & { _id: Types.ObjectId }>;
};

const movementId = new Types.ObjectId();

const buildMovement = (): InventoryMovementRecord & { _id: Types.ObjectId } => ({
  _id: movementId,
  storeId: new Types.ObjectId(),
  vendorId: new Types.ObjectId(),
  cityId: new Types.ObjectId(),
  inventoryStockId: new Types.ObjectId(),
  storeProductId: new Types.ObjectId(),
  productId: new Types.ObjectId(),
  variantId: new Types.ObjectId(),
  movementType: INVENTORY_MOVEMENT_TYPE.STOCK_IN,
  quantity: 10,
  previousAvailableQuantity: 0,
  newAvailableQuantity: 10,
  previousReservedQuantity: 0,
  newReservedQuantity: 0,
  previousTotalQuantity: 0,
  newTotalQuantity: 10,
  reason: 'Opening stock',
  referenceType: INVENTORY_REFERENCE_TYPE.MANUAL,
  referenceId: null,
  notes: null,
  metadata: null,
  createdBy: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

beforeEach(() => {
  movementRepository.findInventoryMovementById = async () => buildMovement();
  movementRepository.listInventoryMovements = async () => ({
    items: [buildMovement()],
    total: 1,
  });
});

test('getInventoryMovementById returns movement', async () => {
  const movement = await getInventoryMovementById(movementId.toString());
  assert.equal(movement.id, movementId.toString());
});

test('getInventoryMovementById returns not found', async () => {
  movementRepository.findInventoryMovementById = async () => null;

  await assert.rejects(
    () => getInventoryMovementById(movementId.toString()),
    (error: unknown) => error instanceof AppError && error.errorCode === ERROR_CODES.NOT_FOUND,
  );
});

test('listInventoryMovements returns paginated items', async () => {
  const response = await listInventoryMovements({ page: 1, limit: 20 });
  assert.equal(response.items.length, 1);
  assert.equal(response.pagination.total, 1);
});
