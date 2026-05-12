import React from 'react';
import { useForm } from 'react-hook-form';

import { Button, Input, ScreenWrapper, Text } from '../../components/common';
import { getFieldError } from '../../utils/form-error.util';
import {
  type LoginPhoneFormValues,
  loginPhoneSchema,
} from '../../validators/auth.validators';

export function LoginScreen() {
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

  const handleContinue = () => {
    void handleSubmit(values => {
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
    })();
  };

  return (
    <ScreenWrapper>
      <Text variant="h2">Delivery Agent Login</Text>
      <Input
        error={getFieldError(errors, 'phone')}
        keyboardType="phone-pad"
        label="Phone number"
        onChangeText={value => setValue('phone', value)}
        placeholder="Phone number"
        value={phone}
      />
      <Button onPress={handleContinue} title="Continue" />
    </ScreenWrapper>
  );
}
