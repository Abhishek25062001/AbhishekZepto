import type { FieldError, FieldErrors, FieldValues, Path } from 'react-hook-form';

export function getFieldError<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  name: Path<TFieldValues>,
): string | undefined {
  const error = errors[name] as FieldError | undefined;

  return typeof error?.message === 'string' ? error.message : undefined;
}
