import { useForm } from 'react-hook-form';

import { Button, Card, Input } from '../../components/common';
import { AuthLayout } from '../../layouts/AuthLayout';
import { getFieldError } from '../../utils/form-error.util';
import {
  type LoginIdentifierFormValues,
  loginIdentifierSchema,
} from '../../validators/auth.validators';

export function LoginPage() {
  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    setError,
    setValue,
    watch,
  } = useForm<LoginIdentifierFormValues>({
    defaultValues: {
      identifier: '',
    },
  });

  const identifier = watch('identifier');

  const handleLogin = handleSubmit(values => {
    const result = loginIdentifierSchema.safeParse(values);

    if (!result.success) {
      const issue = result.error.issues.find(error => error.path[0] === 'identifier');

      setError('identifier', {
        message: issue?.message ?? 'Enter a valid login identifier.',
        type: 'manual',
      });
      return;
    }

    clearErrors('identifier');
  });

  return (
    <AuthLayout>
      <Card title="Vendor Login">
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 'var(--spacing-lg)', width: '320px' }}>
          <Input
            error={getFieldError(errors, 'identifier')}
            label="Phone or email"
            onChange={value => setValue('identifier', value)}
            placeholder="Phone or email"
            value={identifier}
          />
          <Button type="submit">Login</Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
