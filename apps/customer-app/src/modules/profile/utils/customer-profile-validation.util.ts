export type ProfileValidationResult = {
  valid: boolean;
  nameError?: string;
  emailError?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateProfileInput = (input: {
  name: string;
  email: string;
}): ProfileValidationResult => {
  const nameTrimmed = input.name.trim();
  const emailTrimmed = input.email.trim();

  if (nameTrimmed.length > 100) {
    return { valid: false, nameError: 'Name must be 100 characters or less.' };
  }

  if (emailTrimmed.length > 0 && !EMAIL_PATTERN.test(emailTrimmed)) {
    return { valid: false, emailError: 'Enter a valid email address.' };
  }

  return { valid: true };
};
