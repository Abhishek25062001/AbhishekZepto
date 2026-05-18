export const parseNumberParam = (value: string | null, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const parseOptionalString = (value: string | null): string | undefined =>
  value && value.trim() ? value.trim() : undefined;

export const parseOptionalBoolean = (value: string | null): boolean | undefined => {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return undefined;
};

export const setSearchParams = (
  params: URLSearchParams,
  updates: Record<string, string | number | boolean | undefined | null>,
) => {
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      params.delete(key);
      return;
    }
    params.set(key, String(value));
  });
};
