import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  adjustAdminInventoryStock,
  bulkUpdateAdminInventoryThresholds,
  bulkUploadAdminInventoryStocks,
  createAdminInventoryStock,
  deleteAdminInventoryStock,
  updateAdminInventoryStock,
} from '../api/inventory-stock.api';
import type {
  BulkInventoryThresholdPayload,
  BulkInventoryUploadPayload,
  InventoryAdjustmentPayload,
  InventoryStockFormValues,
} from '../types/inventory-stock.types';

export function useInventoryStockMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-inventory-stocks'] });
    void queryClient.invalidateQueries({ queryKey: ['admin-inventory-stock'] });
    void queryClient.invalidateQueries({ queryKey: ['admin-inventory-movements'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: InventoryStockFormValues) => createAdminInventoryStock(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      inventoryStockId,
      payload,
    }: {
      inventoryStockId: string;
      payload: Partial<InventoryStockFormValues>;
    }) => updateAdminInventoryStock(inventoryStockId, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (inventoryStockId: string) => deleteAdminInventoryStock(inventoryStockId),
    onSuccess: invalidate,
  });

  const adjustMutation = useMutation({
    mutationFn: ({
      inventoryStockId,
      payload,
    }: {
      inventoryStockId: string;
      payload: InventoryAdjustmentPayload;
    }) => adjustAdminInventoryStock(inventoryStockId, payload),
    onSuccess: invalidate,
  });

  const bulkUploadMutation = useMutation({
    mutationFn: (payload: BulkInventoryUploadPayload) => bulkUploadAdminInventoryStocks(payload),
    onSuccess: invalidate,
  });

  const bulkThresholdsMutation = useMutation({
    mutationFn: (payload: BulkInventoryThresholdPayload) =>
      bulkUpdateAdminInventoryThresholds(payload),
    onSuccess: invalidate,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    adjustMutation,
    bulkUploadMutation,
    bulkThresholdsMutation,
  };
}
