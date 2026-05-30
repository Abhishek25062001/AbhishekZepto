export const buildCustomerRoom = (customerId: string): string => {
  return `customer:${customerId}`;
};

export const buildDeliveryRoom = (deliveryAgentId: string): string => {
  return `delivery:${deliveryAgentId}`;
};

export const buildVendorRoom = (storeId: string): string => {
  return `vendor:${storeId}`;
};

export const buildOrderRoom = (orderId: string): string => {
  return `order:${orderId}`;
};

export const buildAssignmentRoom = (assignmentId: string): string => {
  return `assignment:${assignmentId}`;
};

export const buildCityRoom = (cityId: string): string => {
  return `city:${cityId}`;
};

export const ADMIN_OPERATIONS_ROOM = 'admin:operations';
