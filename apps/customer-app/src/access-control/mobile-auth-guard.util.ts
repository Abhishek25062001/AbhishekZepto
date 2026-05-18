export type MobileAuthGuardInput = {
  isRestoringSession: boolean;
  isAuthenticated: boolean;
};

export type MobileAuthGuardSurface = 'splash' | 'auth' | 'main';

export const resolveMobileAuthGuardSurface = (
  input: MobileAuthGuardInput,
): MobileAuthGuardSurface => {
  if (input.isRestoringSession) {
    return 'splash';
  }

  if (input.isAuthenticated) {
    return 'main';
  }

  return 'auth';
};

export const shouldExposeProtectedMobileContent = (input: MobileAuthGuardInput): boolean => {
  return !input.isRestoringSession && input.isAuthenticated;
};
