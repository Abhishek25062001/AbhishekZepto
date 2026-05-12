import {
  STORE_ID,
  VENDOR_ACCESS_TOKEN,
  VENDOR_ID,
  VENDOR_REFRESH_TOKEN,
  VENDOR_SESSION_STORAGE_KEYS,
  VENDOR_USER_ID,
} from '../../constants/storage-keys';

export type VendorSession = {
  accessToken: string;
  refreshToken: string;
  storeId: string;
  vendorId: string;
  vendorUserId: string;
};

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

export function saveVendorSession(session: VendorSession) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  // Token values handled here must never be logged.
  storage.setItem(VENDOR_ACCESS_TOKEN, session.accessToken);
  storage.setItem(VENDOR_REFRESH_TOKEN, session.refreshToken);
  storage.setItem(VENDOR_USER_ID, session.vendorUserId);
  storage.setItem(VENDOR_ID, session.vendorId);
  storage.setItem(STORE_ID, session.storeId);
}

export function loadVendorSession(): VendorSession | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const accessToken = storage.getItem(VENDOR_ACCESS_TOKEN);
  const refreshToken = storage.getItem(VENDOR_REFRESH_TOKEN);
  const vendorUserId = storage.getItem(VENDOR_USER_ID);
  const vendorId = storage.getItem(VENDOR_ID);
  const storeId = storage.getItem(STORE_ID);

  if (!accessToken || !refreshToken || !vendorUserId || !vendorId || !storeId) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    storeId,
    vendorId,
    vendorUserId,
  };
}

export function clearVendorSession() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  VENDOR_SESSION_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
}
