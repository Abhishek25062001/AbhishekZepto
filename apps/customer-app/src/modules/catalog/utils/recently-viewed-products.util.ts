import { CUSTOMER_RECENTLY_VIEWED } from '../../../constants/storage-keys';
import { CUSTOMER_RECENTLY_VIEWED_MAX } from '../constants/customer-catalog.constants';
import { getSecureItem, setSecureItem } from '../../../services/storage/secure-storage.service';

const parseIds = (raw: string | null): string[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

export const getRecentlyViewedProductIds = async (): Promise<string[]> => {
  const raw = await getSecureItem(CUSTOMER_RECENTLY_VIEWED);
  return parseIds(raw);
};

export const addRecentlyViewedProduct = async (productId: string): Promise<string[]> => {
  const existing = await getRecentlyViewedProductIds();
  const next = [productId, ...existing.filter((id) => id !== productId)].slice(
    0,
    CUSTOMER_RECENTLY_VIEWED_MAX,
  );
  await setSecureItem(CUSTOMER_RECENTLY_VIEWED, JSON.stringify(next));
  return next;
};
