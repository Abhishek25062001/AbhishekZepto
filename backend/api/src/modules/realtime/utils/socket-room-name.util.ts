export const buildCustomerSocketRoom = (customerId: string): string => {
  return `customer:${customerId}`;
};

export const buildDeliverySocketRoom = (deliveryAgentId: string): string => {
  return `delivery:${deliveryAgentId}`;
};

export const buildVendorSocketRoom = (storeId: string): string => {
  return `vendor:${storeId}`;
};

export const buildAdminSocketRoom = (adminId: string): string => {
  return `admin:${adminId}`;
};

export const buildOrderSocketRoom = (orderId: string): string => {
  return `order:${orderId}`;
};

export const buildAssignmentSocketRoom = (assignmentId: string): string => {
  return `assignment:${assignmentId}`;
};

export const buildCitySocketRoom = (cityId: string): string => {
  return `city:${cityId}`;
};
