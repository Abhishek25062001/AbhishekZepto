export const BASE_UNIT = {
  PIECE: 'piece',
  PACK: 'pack',
  KG: 'kg',
  G: 'g',
  LITRE: 'litre',
  ML: 'ml',
  DOZEN: 'dozen',
} as const;

export type BaseUnit = (typeof BASE_UNIT)[keyof typeof BASE_UNIT];

export const BASE_UNIT_VALUES = [
  BASE_UNIT.PIECE,
  BASE_UNIT.PACK,
  BASE_UNIT.KG,
  BASE_UNIT.G,
  BASE_UNIT.LITRE,
  BASE_UNIT.ML,
  BASE_UNIT.DOZEN,
] as const;
