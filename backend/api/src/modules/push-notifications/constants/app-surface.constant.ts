export const APP_SURFACE = {
  CUSTOMER_APP: 'customer_app',
  DELIVERY_AGENT_APP: 'delivery_agent_app',
} as const;

export type AppSurface = (typeof APP_SURFACE)[keyof typeof APP_SURFACE];

export const APP_SURFACE_VALUES = Object.values(APP_SURFACE) as [
  AppSurface,
  ...AppSurface[],
];
