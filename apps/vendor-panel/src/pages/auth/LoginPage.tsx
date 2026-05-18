import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button, Card, Input } from '../../components/common';
import { AuthLayout } from '../../layouts/AuthLayout';
import { requestOtp } from '../../services/api/auth.api';
import { logVendorAuthEvent } from '../../utils/auth-event-logger';
import { getFieldError } from '../../utils/form-error.util';
import {
  type LoginIdentifierFormValues,
  loginIdentifierSchema,
} from '../../validators/auth.validators';
import {
  getAuthErrorMessage,
  type ApiErrorResponse,
} from '../../../../../packages/shared/api';

export function LoginPage() {
  const navigate = useNavigate();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenError, setScreenError] = useState<string | null>(null);

  const handleLogin = handleSubmit(async values => {
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
    setScreenError(null);
    setIsSubmitting(true);

    try {
      const response = await requestOtp({
        phone: result.data.identifier,
        role: 'vendor_owner',
        purpose: 'login',
        deliveryChannel: 'sms',
      });
      logVendorAuthEvent('request_otp_success', {
        challengeId: response.data.challengeId,
      });

      navigate('/otp-verification', {
        state: {
          canResendAfter: response.data.canResendAfter,
          challengeId: response.data.challengeId,
          expiresIn: response.data.expiresIn,
          maskedTarget: response.data.maskedTarget,
          phone: result.data.identifier,
          role: 'vendor_owner',
        },
      });
    } catch (error) {
      const apiError = error as { response?: { data?: ApiErrorResponse } };
      logVendorAuthEvent('request_otp_failure', {
        errorCode: apiError.response?.data?.error.code,
      });
      setScreenError(
        getAuthErrorMessage(
          apiError.response?.data?.error.code,
          apiError.response?.data?.message,
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <AuthLayout>
      <Card title="Vendor Login">
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 'var(--spacing-lg)', width: '320px' }}>
          <Input
            aria-label="Vendor phone number"
            disabled={isSubmitting}
            error={getFieldError(errors, 'identifier')}
            label="Phone number"
            onChange={(event) => setValue('identifier', event.target.value)}
            placeholder="Phone number"
            value={identifier}
          />
          {screenError ? <p style={{ color: 'var(--color-error)', margin: 0 }}>{screenError}</p> : null}
          <Button aria-label="Send vendor login OTP" loading={isSubmitting} type="submit">Continue</Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
