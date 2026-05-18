const ERROR_MESSAGES: Record<string, string> = {
  CITY_NOT_FOUND: 'City not found.',
  CITY_SLUG_ALREADY_EXISTS: 'A city with this slug already exists.',
  CITY_HAS_ACTIVE_SERVICE_AREAS: 'Cannot delete a city with active service areas.',
  CITY_HAS_ACTIVE_STORES: 'Cannot delete a city with active stores.',
  INVALID_CITY_STATUS: 'Invalid city status.',
  CITY_NOT_SERVICEABLE: 'City is not marked as serviceable.',
  SERVICE_AREA_NOT_FOUND: 'Service area not found.',
  SERVICE_AREA_SLUG_ALREADY_EXISTS: 'A service area with this slug already exists.',
  SERVICE_AREA_HAS_ACTIVE_STORES: 'Cannot delete a service area linked to active stores.',
  INVALID_SERVICE_AREA_STATUS: 'Invalid service area status.',
  INVALID_SERVICE_AREA_CITY: 'Invalid city selected for this service area.',
  SERVICE_AREA_NOT_SERVICEABLE: 'Service area is not marked as serviceable.',
  STORE_NOT_FOUND: 'Store not found.',
  STORE_SLUG_ALREADY_EXISTS: 'A store with this slug already exists in the city.',
  STORE_CODE_ALREADY_EXISTS: 'Store code already exists.',
  STORE_HAS_ACTIVE_ORDERS: 'Cannot delete a store with active orders.',
  INVALID_STORE_STATUS: 'Invalid store status.',
  INVALID_STORE_TYPE: 'Invalid store type.',
  INVALID_STORE_CITY: 'Invalid city selected for this store.',
  INVALID_STORE_SERVICE_AREA: 'One or more service areas are invalid for this city.',
  STORE_CODE_IMMUTABLE: 'Store code cannot be changed after creation.',
  STORE_CLOSURE_REASON_REQUIRED: 'Closure reason is required when the store is closed.',
};

export const mapStoreErrorCodeToMessage = (errorCode: string | undefined, fallback: string) => {
  if (!errorCode) {
    return fallback;
  }
  const normalized = errorCode.includes('.') ? errorCode.split('.').pop() ?? errorCode : errorCode;
  return ERROR_MESSAGES[normalized] ?? fallback;
};

export const extractApiErrorCode = (error: unknown): string | undefined => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return undefined;
  }
  const response = (error as { response?: { data?: { error?: { code?: string } } } }).response;
  return response?.data?.error?.code;
};

export const DELETE_CONFIRMATION = {
  city: 'Delete this city? Active service areas and stores must be removed first.',
  serviceArea: 'Delete this service area? Linked stores must be removed first.',
  store: 'Delete this store? Active orders may block deletion.',
} as const;
