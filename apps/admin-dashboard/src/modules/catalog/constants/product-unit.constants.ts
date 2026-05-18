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

export const BASE_UNIT_VALUES: BaseUnit[] = Object.values(BASE_UNIT);

export const BASE_UNIT_LABELS: Record<BaseUnit, string> = {
  piece: 'Piece',
  pack: 'Pack',
  kg: 'Kg',
  g: 'G',
  litre: 'Litre',
  ml: 'Ml',
  dozen: 'Dozen',
};
