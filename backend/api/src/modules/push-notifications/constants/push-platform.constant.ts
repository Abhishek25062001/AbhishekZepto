export const PUSH_PLATFORM = {
  ANDROID: 'android',
  IOS: 'ios',
  WEB: 'web',
} as const;

export type PushPlatform = (typeof PUSH_PLATFORM)[keyof typeof PUSH_PLATFORM];

export const PUSH_PLATFORM_VALUES = Object.values(PUSH_PLATFORM) as [
  PushPlatform,
  ...PushPlatform[],
];
