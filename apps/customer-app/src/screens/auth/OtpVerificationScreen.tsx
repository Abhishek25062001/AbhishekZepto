import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { useForm } from 'react-hook-form';

import { Button, Input, ScreenWrapper, Text } from '../../components/common';
import type { AuthStackParamList } from '../../app/navigation.types';
import { requestOtp, verifyOtp } from '../../services/api/auth.api';
import { saveCustomerSession } from '../../services/auth/session-storage.service';
import { useAuthStore } from '../../store/auth.store';
import { APP_ENV } from '../../config/env';
import { useCountdown } from '../../hooks/useCountdown';
import { logCustomerAuthEvent } from '../../utils/auth-event-logger';
import { getFieldError } from '../../utils/form-error.util';
import {
  isCustomerAuthResponse,
  mapVerifyOtpResponseToCustomerSession,
} from '../../utils/auth-response.util';
import {
  buildAuthDeviceInput,
  getAuthErrorMessage,
  type ApiErrorResponse,
} from '../../../../../packages/shared/api';
import { otpSchema, type OtpFormValues } from '../../validators/auth.validators';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerification'>;

export function OtpVerificationScreen({ navigation, route }: Props) {
  const {
    canResendAfter,
    challengeId: initialChallengeId,
    expiresIn: initialExpiresIn,
    maskedTarget,
    phone,
    role,
  } = route.params;
  const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    setError,
    setValue,
    watch,
  } = useForm<OtpFormValues>({
    defaultValues: {
      otp: '',
    },
  });
  const [challengeId, setChallengeId] = React.useState(initialChallengeId);
  const resendCountdown = useCountdown(canResendAfter);
  const expiryCountdown = useCountdown(initialExpiresIn);
  const [screenError, setScreenError] = React.useState<string | null>(null);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const otp = watch('otp');
  const isOtpExpired = expiryCountdown.isComplete;

  React.useEffect(() => {
    if (role !== 'customer') {
      navigation.navigate('Login');
    }
  }, [navigation, role]);

  const handleVerify = () => {
    void handleSubmit(async (values) => {
      const result = otpSchema.safeParse(values);

      if (!result.success) {
        const issue = result.error.issues.find((error) => error.path[0] === 'otp');

        setError('otp', {
          message: issue?.message ?? 'Enter a valid OTP code.',
          type: 'manual',
        });
        return;
      }

      clearErrors('otp');
      setIsVerifying(true);
      setScreenError(null);
      setStatusMessage(null);

      try {
        const response = await verifyOtp({
          phone,
          role: 'customer',
          otp: result.data.otp,
          challengeId,
          device: buildAuthDeviceInput({
            appSurface: 'customer_app',
            platform:
              Platform.OS === 'ios'
                ? 'ios'
                : Platform.OS === 'android'
                  ? 'android'
                  : 'unknown',
            appVersion: APP_ENV === 'development' ? 'dev-build' : '1.0.0',
            deviceId: 'customer-device-placeholder',
          }),
        });

        if (!isCustomerAuthResponse(response.data)) {
          setScreenError('This account cannot be used in the Customer App.');
          return;
        }

        const customerSession =
          mapVerifyOtpResponseToCustomerSession(response.data);

        await saveCustomerSession(customerSession);
        setAuthSession(customerSession);
        logCustomerAuthEvent('verify_otp_success', {
          customerId: customerSession.customerId,
          role: customerSession.role,
        });
      } catch (error) {
        const apiError = error as { response?: { data?: ApiErrorResponse } };
        logCustomerAuthEvent('verify_otp_failure', {
          challengeId,
          errorCode: apiError.response?.data?.error.code,
        });
        setScreenError(
          getAuthErrorMessage(
            apiError.response?.data?.error.code,
            apiError.response?.data?.message,
          ),
        );
      } finally {
        setIsVerifying(false);
      }
    })();
  };

  const handleResend = async () => {
    if (!resendCountdown.isComplete || isResending) {
      return;
    }

    setIsResending(true);
    setScreenError(null);
      setStatusMessage(null);

    try {
      const response = await requestOtp({
        phone,
        role: 'customer',
        purpose: 'login',
        deliveryChannel: 'sms',
      });

      setChallengeId(response.data.challengeId);
      resendCountdown.reset(response.data.canResendAfter);
      expiryCountdown.reset(response.data.expiresIn);
      setValue('otp', '');
      setStatusMessage('A new OTP has been sent to your phone number.');
    } catch (error) {
      const apiError = error as { response?: { data?: ApiErrorResponse } };
      setScreenError(
        getAuthErrorMessage(
          apiError.response?.data?.error.code,
          apiError.response?.data?.message,
        ),
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <ScreenWrapper>
      <Text variant="h2">Verify OTP</Text>
      <Text color="secondary">Enter the code sent to {maskedTarget}.</Text>
      {statusMessage ? <Text color="success">{statusMessage}</Text> : null}
      <Text color="secondary" variant="small">
        OTP expires in {expiryCountdown.secondsRemaining}s
      </Text>
      {isOtpExpired ? (
        <Text color="warning">This OTP has expired. Please request a new OTP.</Text>
      ) : null}
      <Text color="secondary" variant="small">
        {!resendCountdown.isComplete
          ? `You can resend OTP in ${resendCountdown.secondsRemaining}s.`
          : 'You can request a new OTP now.'}
      </Text>
      <Input
        accessibilityLabel="One-time password code"
        disabled={isVerifying}
        error={getFieldError(errors, 'otp') ?? screenError ?? undefined}
        keyboardType="number-pad"
        label="OTP code"
        onChangeText={(value) => setValue('otp', value)}
        placeholder="Enter OTP"
        value={otp}
      />
      <Button
        accessibilityLabel="Verify OTP and sign in"
        disabled={isVerifying || isOtpExpired}
        loading={isVerifying}
        onPress={handleVerify}
        title="Verify and Login"
      />
      <Button
        accessibilityLabel="Resend one-time password"
        disabled={!resendCountdown.isComplete}
        loading={isResending}
        onPress={handleResend}
        title={
          !resendCountdown.isComplete
            ? `Resend in ${resendCountdown.secondsRemaining}s`
            : 'Resend OTP'
        }
        variant="ghost"
      />
      <Button
        accessibilityLabel="Change phone number"
        onPress={() => {
          setValue('otp', '');
          navigation.goBack();
        }}
        title="Change number"
        variant="ghost"
      />
    </ScreenWrapper>
  );
}
