import {
  ADMIN_ACCESS_TOKEN,
  ADMIN_ID,
  ADMIN_REFRESH_TOKEN,
  ADMIN_SESSION_STORAGE_KEYS,
} from '../../constants/storage-keys';

export type AdminSession = {
  accessToken: string;
  adminId: string;
  refreshToken: string;
};

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

export function saveAdminSession(session: AdminSession) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  // Token values handled here must never be logged.
  storage.setItem(ADMIN_ACCESS_TOKEN, session.accessToken);
  storage.setItem(ADMIN_REFRESH_TOKEN, session.refreshToken);
  storage.setItem(ADMIN_ID, session.adminId);
}

export function loadAdminSession(): AdminSession | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const accessToken = storage.getItem(ADMIN_ACCESS_TOKEN);
  const refreshToken = storage.getItem(ADMIN_REFRESH_TOKEN);
  const adminId = storage.getItem(ADMIN_ID);

  if (!accessToken || !refreshToken || !adminId) {
    return null;
  }

  return {
    accessToken,
    adminId,
    refreshToken,
  };
}

export function clearAdminSession() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  ADMIN_SESSION_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
}
