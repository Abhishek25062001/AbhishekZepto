export const FOOD_TYPE = {
  VEG: 'veg',
  NON_VEG: 'non_veg',
  EGG: 'egg',
  NOT_APPLICABLE: 'not_applicable',
} as const;

export type FoodType = (typeof FOOD_TYPE)[keyof typeof FOOD_TYPE];

export const FOOD_TYPE_VALUES = [
  FOOD_TYPE.VEG,
  FOOD_TYPE.NON_VEG,
  FOOD_TYPE.EGG,
  FOOD_TYPE.NOT_APPLICABLE,
] as const;
