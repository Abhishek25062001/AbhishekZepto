import { env } from './env';

export const isDebugMode = env.DEBUG_MODE || false;

export const canExposeDebugInfo = (): boolean => {
  return isDebugMode && env.APP_ENV !== 'production';
};
