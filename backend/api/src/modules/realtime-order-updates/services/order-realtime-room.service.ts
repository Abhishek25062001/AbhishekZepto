export const buildOrderRoom = (orderId: string): string => `order:${orderId}`;

export const buildCustomerRoom = (customerId: string): string => `customer:${customerId}`;

export const buildVendorRoom = (storeId: string): string => `vendor:${storeId}`;

export const buildCityRoom = (cityId: string): string => `city:${cityId}`;
