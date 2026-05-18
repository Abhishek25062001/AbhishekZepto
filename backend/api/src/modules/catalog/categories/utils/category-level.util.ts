export const ROOT_CATEGORY_LEVEL = 1;
export const MAX_CATEGORY_LEVEL = 2;

export const resolveCategoryLevel = (parentLevel: number | null): number => {
  if (parentLevel === null) {
    return ROOT_CATEGORY_LEVEL;
  }

  return parentLevel + 1;
};

export const assertCategoryLevelWithinLimit = (level: number): void => {
  if (level > MAX_CATEGORY_LEVEL) {
    throw new Error('CATEGORY_LEVEL_LIMIT_EXCEEDED');
  }
};
