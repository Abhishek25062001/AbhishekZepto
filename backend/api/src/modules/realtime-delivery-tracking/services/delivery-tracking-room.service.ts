export const buildOrderRoom = (orderId: string): string => `order:${orderId}`;

export const buildAssignmentRoom = (assignmentId: string): string =>
  `assignment:${assignmentId}`;

export const buildCustomerRoom = (customerId: string): string =>
  `customer:${customerId}`;

export const buildDeliveryRoom = (deliveryAgentId: string): string =>
  `delivery:${deliveryAgentId}`;

export const buildCityRoom = (cityId: string): string => `city:${cityId}`;
