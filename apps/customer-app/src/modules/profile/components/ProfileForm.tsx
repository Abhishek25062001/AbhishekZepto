import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ErrorView, Input, Text } from '../../../components/common';
import { spacing } from '../../../theme';
import { useUpdateCustomerProfile } from '../hooks/useUpdateCustomerProfile';
import type { CustomerProfile } from '../types/profile.types';
import { getProfileErrorMessage } from '../utils/customer-profile-error-message.util';
import { validateProfileInput } from '../utils/customer-profile-validation.util';
import { ProfilePhoneField } from './ProfilePhoneField';

type ProfileFormProps = {
  profile: CustomerProfile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const updateMutation = useUpdateCustomerProfile();
  const [name, setName] = useState(profile.name ?? '');
  const [email, setEmail] = useState(profile.email ?? '');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(profile.name ?? '');
    setEmail(profile.email ?? '');
  }, [profile.customerId, profile.email, profile.name]);

  const onSave = async () => {
    setSaveError(null);
    setSavedMessage(null);
    setFieldErrors({});

    const validation = validateProfileInput({ name, email });

    if (!validation.valid) {
      setFieldErrors({
        name: validation.nameError,
        email: validation.emailError,
      });
      return;
    }

    const nameTrimmed = name.trim();
    const emailTrimmed = email.trim();

    try {
      await updateMutation.mutateAsync({
        name: nameTrimmed.length > 0 ? nameTrimmed : null,
        email: emailTrimmed.length > 0 ? emailTrimmed : null,
      });
      setSavedMessage('Profile saved.');
    } catch (error) {
      setSaveError(getProfileErrorMessage(error, 'Could not save profile.'));
    }
  };

  return (
    <View style={styles.container}>
      <ProfilePhoneField phone={profile.phone} />
      <Input
        error={fieldErrors.name}
        label="Name"
        onChangeText={setName}
        placeholder="Your name"
        value={name}
      />
      <Input
        error={fieldErrors.email}
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="you@example.com"
        value={email}
      />
      {saveError ? <ErrorView message={saveError} /> : null}
      {savedMessage ? (
        <Text color="secondary" variant="small">
          {savedMessage}
        </Text>
      ) : null}
      <Button
        disabled={updateMutation.isPending}
        loading={updateMutation.isPending}
        onPress={() => void onSave()}
        title="Save profile"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
});
