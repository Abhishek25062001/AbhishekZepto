import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useRoute, type RouteProp } from '@react-navigation/native';

import { Button, ScreenWrapper } from '../../components/common';
import { useDeliveryAssignmentRoom } from '../../modules/realtime-operations/hooks/useDeliveryAssignmentRoom';
import { useDeliveryStore } from '../../store/delivery.store';
import { markPickedUp } from '../../services/api/delivery.api';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { colors, radius, spacing, typography } from '../../theme';
import type { PickupVerificationPayload } from '../../types/delivery.types';
import type { MainStackParamList } from '../../app/navigation.types';

type PickupConfirmationRouteProp = RouteProp<
  MainStackParamList,
  'PickupConfirmation'
>;

type VerificationMethod = 'otp' | 'barcode' | 'manual';

const VERIFICATION_METHODS: { label: string; value: VerificationMethod }[] = [
  { label: 'OTP', value: 'otp' },
  { label: 'Barcode', value: 'barcode' },
  { label: 'Manual', value: 'manual' },
];

export function PickupConfirmationScreen() {
  const route = useRoute<PickupConfirmationRouteProp>();
  const { assignmentId } = route.params;
  const navigation = useAppNavigation();
  const setCurrentDeliveryStatus = useDeliveryStore(
    (state) => state.setCurrentDeliveryStatus,
  );
  const currentDeliveryStatus = useDeliveryStore(
    (state) => state.currentDeliveryStatus,
  );
  useDeliveryAssignmentRoom(assignmentId);

  // Form state — all optional (placeholder metadata only)
  const [verificationMethod, setVerificationMethod] = useState<
    VerificationMethod | undefined
  >(undefined);
  const [verificationValue, setVerificationValue] = useState('');
  const [notes, setNotes] = useState('');
  const [isPickedUp, setIsPickedUp] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      const payload: PickupVerificationPayload = {};
      if (verificationMethod) {
        payload.verificationMethod = verificationMethod;
      }
      if (verificationValue.trim()) {
        payload.verificationValue = verificationValue.trim();
      }
      if (notes.trim()) {
        payload.notes = notes.trim();
      }
      return markPickedUp(assignmentId, payload);
    },
    onSuccess: () => {
      setCurrentDeliveryStatus('picked_up');
      setIsPickedUp(true);
    },
  });

  useEffect(() => {
    if (currentDeliveryStatus === 'picked_up') {
      setIsPickedUp(true);
    }
  }, [currentDeliveryStatus]);

  // Success state — show completion panel
  if (isPickedUp) {
    return (
      <ScreenWrapper scrollable={false}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <RNText style={styles.successEmoji}>📦✅</RNText>
          </View>
          <RNText style={styles.successHeading}>Pickup Confirmed!</RNText>
          <RNText style={styles.successSubheading}>
            You're now ready to head to the customer's delivery address.
          </RNText>
          <View style={styles.ctaWrapper}>
            <Button
              title="Back to Dashboard"
              variant="primary"
              size="lg"
              onPress={() => navigation.navigate('DeliveryHome')}
            />
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable>
      <View style={styles.container}>
        {/* Icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <RNText style={styles.iconEmoji}>📦</RNText>
          </View>
        </View>

        {/* Header */}
        <RNText style={styles.heading}>Confirm Pickup</RNText>
        <RNText style={styles.subheading}>
          Confirm you've collected the order from the store. Verification
          details are optional placeholders.
        </RNText>

        {/* Assignment info card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <RNText style={styles.cardLabel}>Assignment ID</RNText>
            <RNText style={styles.cardValue} numberOfLines={1}>
              {assignmentId.slice(-8).toUpperCase()}
            </RNText>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <RNText style={styles.cardLabel}>Status Transition</RNText>
            <View style={styles.badgeGreen}>
              <RNText style={styles.badgeGreenText}>Arrived → Picked Up</RNText>
            </View>
          </View>
        </View>

        {/* Verification form (optional placeholder) */}
        <View style={styles.formCard}>
          <RNText style={styles.formTitle}>
            Verification Details{' '}
            <RNText style={styles.formOptional}>(Optional)</RNText>
          </RNText>

          {/* Method segmented control */}
          <RNText style={styles.formLabel}>Method</RNText>
          <View style={styles.segmentRow}>
            {VERIFICATION_METHODS.map((m) => (
              <TouchableOpacity
                key={m.value}
                style={[
                  styles.segment,
                  verificationMethod === m.value && styles.segmentActive,
                ]}
                onPress={() =>
                  setVerificationMethod(
                    verificationMethod === m.value ? undefined : m.value,
                  )
                }
              >
                <RNText
                  style={[
                    styles.segmentText,
                    verificationMethod === m.value && styles.segmentTextActive,
                  ]}
                >
                  {m.label}
                </RNText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Verification code (only when OTP or Barcode) */}
          {(verificationMethod === 'otp' ||
            verificationMethod === 'barcode') && (
            <>
              <RNText style={styles.formLabel}>
                {verificationMethod === 'otp'
                  ? 'OTP Code'
                  : 'Barcode / QR Value'}
              </RNText>
              <TextInput
                style={styles.textInput}
                placeholder={
                  verificationMethod === 'otp'
                    ? 'Enter 4–6 digit OTP'
                    : 'Enter scanned barcode value'
                }
                placeholderTextColor={PLACEHOLDER_COLOR}
                value={verificationValue}
                onChangeText={setVerificationValue}
                keyboardType={
                  verificationMethod === 'otp' ? 'number-pad' : 'default'
                }
                maxLength={verificationMethod === 'otp' ? 6 : 100}
              />
            </>
          )}

          {/* Notes */}
          <RNText style={styles.formLabel}>Notes</RNText>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Optional pickup notes or observations…"
            placeholderTextColor={PLACEHOLDER_COLOR}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            maxLength={300}
          />
        </View>

        {/* Error message */}
        {mutation.isError && (
          <View style={styles.errorBox}>
            <RNText style={styles.errorText}>
              Failed to confirm pickup. Please try again.
            </RNText>
          </View>
        )}

        {/* CTA */}
        <View style={styles.ctaWrapper}>
          {mutation.isPending ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={GREEN} />
              <RNText style={styles.loadingText}>Confirming pickup…</RNText>
            </View>
          ) : (
            <Button
              title="Confirm Package Pickup"
              variant="primary"
              size="lg"
              disabled={mutation.isPending}
              onPress={() => mutation.mutate()}
            />
          )}
        </View>

        {/* Back link */}
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.goBack()}
          disabled={mutation.isPending}
        >
          <RNText style={styles.backLinkText}>← Back</RNText>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DARK_BG = '#0D1526';
const CARD_BG = 'rgba(31, 45, 75, 0.85)';
const CARD_BORDER = 'rgba(60, 80, 120, 0.5)';
const GREEN = '#22C55E';
const GREEN_GLOW = 'rgba(34, 197, 94, 0.15)';
const INPUT_BG = 'rgba(20, 35, 65, 0.9)';
const INPUT_BORDER = 'rgba(80, 100, 140, 0.5)';
const PLACEHOLDER_COLOR = 'rgba(150, 170, 200, 0.5)';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: DARK_BG,
    flex: 1,
    minHeight: '100%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  successContainer: {
    alignItems: 'center',
    backgroundColor: DARK_BG,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIcon: {
    alignItems: 'center',
    backgroundColor: GREEN_GLOW,
    borderColor: GREEN,
    borderRadius: 60,
    borderWidth: 2,
    height: 120,
    justifyContent: 'center',
    marginBottom: spacing.xl,
    width: 120,
  },
  successEmoji: {
    fontSize: 44,
  },
  successHeading: {
    color: '#FFFFFF',
    fontSize: typography.h1,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  successSubheading: {
    color: 'rgba(200, 215, 230, 0.75)',
    fontSize: typography.body,
    lineHeight: 22,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  iconWrapper: {
    marginBottom: spacing.lg,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: GREEN_GLOW,
    borderColor: GREEN,
    borderRadius: 60,
    borderWidth: 2,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  iconEmoji: {
    fontSize: 52,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: typography.h1,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subheading: {
    color: 'rgba(200, 210, 230, 0.75)',
    fontSize: typography.body,
    lineHeight: 22,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  card: {
    alignSelf: 'stretch',
    backgroundColor: CARD_BG,
    borderColor: CARD_BORDER,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  cardRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  cardLabel: {
    color: 'rgba(180, 195, 220, 0.7)',
    fontSize: typography.caption,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '600',
    maxWidth: '55%',
  },
  divider: {
    backgroundColor: CARD_BORDER,
    height: 1,
  },
  badgeGreen: {
    backgroundColor: GREEN_GLOW,
    borderColor: GREEN,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeGreenText: {
    color: GREEN,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  formCard: {
    alignSelf: 'stretch',
    backgroundColor: CARD_BG,
    borderColor: CARD_BORDER,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  formOptional: {
    color: 'rgba(180, 195, 220, 0.6)',
    fontWeight: '400',
  },
  formLabel: {
    color: 'rgba(180, 195, 220, 0.7)',
    fontSize: typography.caption,
    fontWeight: '500',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  segment: {
    alignItems: 'center',
    borderColor: INPUT_BORDER,
    borderRadius: radius.sm,
    borderWidth: 1,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  segmentActive: {
    backgroundColor: GREEN_GLOW,
    borderColor: GREEN,
  },
  segmentText: {
    color: 'rgba(180, 195, 220, 0.7)',
    fontSize: typography.small,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: GREEN,
  },
  textInput: {
    backgroundColor: INPUT_BG,
    borderColor: INPUT_BORDER,
    borderRadius: radius.md,
    borderWidth: 1,
    color: '#FFFFFF',
    fontSize: typography.body,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  textArea: {
    height: 88,
    textAlignVertical: 'top',
  },
  errorBox: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderColor: colors.error,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.body,
    textAlign: 'center',
  },
  ctaWrapper: {
    alignSelf: 'stretch',
    marginBottom: spacing.md,
  },
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  loadingText: {
    color: GREEN,
    fontSize: typography.body,
    fontWeight: '600',
  },
  backLink: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
  backLinkText: {
    color: 'rgba(180, 195, 220, 0.6)',
    fontSize: typography.body,
  },
});
