export const colors = {
  primary: '#7C3AED',
  primaryDark: '#5B21B6',
  primaryLight: '#EDE9FE',
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#2563EB',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
} as const;

export const typography = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  h1: 32,
  h2: 24,
  h3: 20,
  body: 16,
  small: 14,
  caption: 12,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 999,
} as const;

export const shadows = {
  mobileCard: 'mobile card shadow placeholder',
  webCard: '0 1px 2px rgba(17, 24, 39, 0.08)',
} as const;
