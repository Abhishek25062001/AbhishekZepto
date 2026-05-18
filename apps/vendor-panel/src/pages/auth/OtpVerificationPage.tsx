import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Button, Card, Input } from '../../components/common';
import { AuthLayout } from '../../layouts/AuthLayout';
import { APP_ENV } from '../../config/env';
import { useCountdown } from '../../hooks/useCountdown';
import { requestOtp, verifyOtp } from '../../services/api/auth.api';
import { saveVendorSession } from '../../services/auth/session-storage.service';
import { useAuthStore } from '../../store/auth.store';
import { logVendorAuthEvent } from '../../utils/auth-event-logger';
import { getFieldError } from '../../utils/form-error.util';
import { isVendorAuthResponse, mapVerifyOtpResponseToVendorSession } from '../../utils/auth-response.util';
import {
  buildAuthDeviceInput,
  getAuthErrorMessage,
  type ApiErrorResponse,
} from '../../../../../packages/shared/api';
import { otpSchema, type OtpFormValues } from '../../validators/auth.validators';

type OtpVerificationState = {
  canResendAfter: number;
  challengeId: string;
  expiresIn: number;
  maskedTarget: string;
  phone: string;
  role: 'vendor_owner';
};

export function OtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as OtpVerificationState | null;
  const setAuthSession = useAuthStore((store) => store.setAuthSession);
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
  const [screenError, setScreenError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [challengeId, setChallengeId] = useState(state?.challengeId ?? '');
  const otp = watch('otp');
  const resendCountdown = useCountdown(state?.canResendAfter ?? 0);
  const expiryCountdown = useCountdown(state?.expiresIn ?? 0);
  const isOtpExpired = expiryCountdown.isComplete;

  useEffect(() => {
    if (!state) {
      navigate('/login', { replace: true });
    }
  }, [navigate, state]);

  useEffect(() => {
    if (state && state.role !== 'vendor_owner') {
      navigate('/login', { replace: true });
    }
  }, [navigate, state]);

  if (!state) {
    return null;
  }

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
      setIsSubmitting(true);
      setScreenError(null);
      setStatusMessage(null);

      try {
        const response = await verifyOtp({
          phone: state.phone,
          role: 'vendor_owner',
          otp: result.data.otp,
          challengeId,
          device: buildAuthDeviceInput({
            appSurface: 'vendor_panel',
            platform: 'web',
            appVersion: APP_ENV === 'development' ? 'dev-build' : '1.0.0',
            deviceId: 'vendor-web-browser',
          }),
        });

        if (!isVendorAuthResponse(response.data)) {
          setScreenError('This account cannot be used in the Vendor Panel.');
          return;
        }

        const vendorSession = mapVerifyOtpResponseToVendorSession(response.data);

        saveVendorSession(vendorSession);
        setAuthSession(vendorSession);
        logVendorAuthEvent('verify_otp_success', {
          role: vendorSession.role,
          vendorUserId: vendorSession.vendorUserId,
        });
        navigate('/dashboard', { replace: true });
      } catch (error) {
        const apiError = error as { response?: { data?: ApiErrorResponse } };
        logVendorAuthEvent('verify_otp_failure', {
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
        setIsSubmitting(false);
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
        phone: state.phone,
        role: 'vendor_owner',
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
    <AuthLayout>
      <Card description={`Enter the code sent to ${state.maskedTarget}.`} title="Verify OTP">
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)', width: '320px' }}>
          {statusMessage ? <p style={{ color: 'var(--color-success)', margin: 0 }}>{statusMessage}</p> : null}
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            OTP expires in {expiryCountdown.secondsRemaining}s
          </p>
          {isOtpExpired ? (
            <p style={{ color: 'var(--color-warning)', margin: 0 }}>
              This OTP has expired. Please request a new OTP.
            </p>
          ) : null}
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            {resendCountdown.isComplete
              ? 'You can request a new OTP now.'
              : `You can resend OTP in ${resendCountdown.secondsRemaining}s.`}
          </p>
          <Input
            aria-label="Vendor one-time password code"
            disabled={isSubmitting}
            error={getFieldError(errors, 'otp') ?? screenError ?? undefined}
            label="OTP code"
            onChange={(event) => setValue('otp', event.target.value)}
            placeholder="Enter OTP"
            value={otp}
          />
          <Button
            aria-label="Verify vendor OTP and sign in"
            disabled={isOtpExpired}
            loading={isSubmitting}
            onClick={() => void handleVerify()}
          >
            Verify and Login
          </Button>
          <Button
            aria-label="Resend vendor one-time password"
            disabled={!resendCountdown.isComplete}
            loading={isResending}
            onClick={() => void handleResend()}
            variant="ghost"
          >
            {resendCountdown.isComplete
              ? 'Resend OTP'
              : `Resend in ${resendCountdown.secondsRemaining}s`}
          </Button>
          <Button
            aria-label="Change vendor phone number"
            onClick={() => {
              setValue('otp', '');
              navigate('/login', { replace: true });
            }}
            variant="ghost"
          >
            Change number
          </Button>
        </div>
      </Card>
    </AuthLayout>
  );
}
