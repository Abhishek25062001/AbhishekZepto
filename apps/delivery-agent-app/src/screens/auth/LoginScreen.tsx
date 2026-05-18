import React from 'react';
import { useForm } from 'react-hook-form';

import { Button, Input, ScreenWrapper, Text } from '../../components/common';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { requestOtp } from '../../services/api/auth.api';
import { logDeliveryAuthEvent } from '../../utils/auth-event-logger';
import { getFieldError } from '../../utils/form-error.util';
import {
  type LoginPhoneFormValues,
  loginPhoneSchema,
} from '../../validators/auth.validators';
import { getAuthErrorMessage, type ApiErrorResponse } from '../../../../../packages/shared/api';

export function LoginScreen() {
  const navigation = useAppNavigation();
  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    setError,
    setValue,
    watch,
  } = useForm<LoginPhoneFormValues>({
    defaultValues: {
      phone: '',
    },
  });

  const phone = watch('phone');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [screenError, setScreenError] = React.useState<string | null>(null);

  const handleContinue = () => {
    void handleSubmit(async values => {
      const result = loginPhoneSchema.safeParse(values);

      if (!result.success) {
        const issue = result.error.issues.find(error => error.path[0] === 'phone');

        setError('phone', {
          message: issue?.message ?? 'Enter a valid phone number.',
          type: 'manual',
        });
        return;
      }

      clearErrors('phone');
      setScreenError(null);
      setIsSubmitting(true);

      try {
        const response = await requestOtp({
          phone: result.data.phone,
          role: 'delivery_agent',
          purpose: 'login',
          deliveryChannel: 'sms',
        });
        logDeliveryAuthEvent('request_otp_success', {
          canResendAfter: response.data.canResendAfter,
          deliveryChannel: response.data.deliveryChannel,
          phone: result.data.phone,
        });

        navigation.navigate('OtpVerification', {
          phone: result.data.phone,
          role: 'delivery_agent',
          challengeId: response.data.challengeId,
          expiresIn: response.data.expiresIn,
          maskedTarget: response.data.maskedTarget,
          canResendAfter: response.data.canResendAfter,
        });
      } catch (error) {
        const apiError = error as { response?: { data?: ApiErrorResponse } };
        logDeliveryAuthEvent('request_otp_failure', {
          errorCode: apiError.response?.data?.error.code,
          phone: result.data.phone,
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
    })();
  };

  return (
    <ScreenWrapper>
      <Text variant="h2">Delivery Agent Login</Text>
      <Text color="secondary">
        We&apos;ll send a one-time code to your phone number.
      </Text>
      <Input
        accessibilityLabel="Delivery agent phone number"
        disabled={isSubmitting}
        error={getFieldError(errors, 'phone')}
        keyboardType="phone-pad"
        label="Phone number"
        onChangeText={value => setValue('phone', value)}
        placeholder="Phone number"
        value={phone}
      />
      {screenError ? <Text color="error">{screenError}</Text> : null}
      <Button
        accessibilityLabel="Continue to OTP verification"
        disabled={isSubmitting}
        loading={isSubmitting}
        onPress={handleContinue}
        title="Continue"
      />
    </ScreenWrapper>
  );
}
