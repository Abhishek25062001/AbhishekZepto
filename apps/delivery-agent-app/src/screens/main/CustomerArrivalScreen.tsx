import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Button, ScreenWrapper } from '../../components/common';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { colors, radius, spacing, typography } from '../../theme';
import type { MainStackParamList } from '../../app/navigation.types';
import { useDeliveryStore } from '../../store/delivery.store';
import { markDelivered, markFailed } from '../../services/api/delivery.api';

type CustomerArrivalRouteProp = RouteProp<
  MainStackParamList,
  'CustomerArrival'
>;

export function CustomerArrivalScreen() {
  const route = useRoute<CustomerArrivalRouteProp>();
  const { assignmentId } = route.params;
  const navigation = useAppNavigation();

  // Zustand Store selectors
  const clearCurrentDelivery = useDeliveryStore((state) => state.clearCurrentDelivery);
  const setAvailabilityStatus = useDeliveryStore((state) => state.setAvailabilityStatus);

  // Checklist state
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    countMatches: false,
    handedOver: false,
    verificationReady: false,
  });

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Verification method state
  const [verificationMethod, setVerificationMethod] = useState<'otp' | 'manual'>('otp');
  const [otpCode, setOtpCode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Failure flow state
  const [showFailureMode, setShowFailureMode] = useState(false);
  const [failureReason, setFailureReason] = useState('Customer not available');
  const [customFailureReason, setCustomFailureReason] = useState('');

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isAllChecked =
    checkedItems.countMatches &&
    checkedItems.handedOver &&
    checkedItems.verificationReady;

  // Validation rules
  const canDeliver = isAllChecked && (verificationMethod !== 'otp' || otpCode.trim().length >= 4);
  const canFail = failureReason !== 'Other' || customFailureReason.trim().length > 0;

  // TanStack Query Mutations
  const deliverMutation = useMutation({
    mutationFn: () =>
      markDelivered(assignmentId, {
        verificationMethod,
        verificationValue: verificationMethod === 'otp' ? otpCode.trim() : undefined,
        notes: deliveryNotes.trim() || undefined,
      }),
    onSuccess: () => {
      clearCurrentDelivery();
      setAvailabilityStatus('online');
      setIsSuccess(true);
      setErrorMessage(null);
      setShowInfoModal(true);
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      const msg = err?.response?.data?.message || 'Failed to complete delivery handover.';
      setErrorMessage(msg);
    },
  });

  const failMutation = useMutation({
    mutationFn: () =>
      markFailed(assignmentId, {
        failureReason: failureReason === 'Other' ? customFailureReason.trim() : failureReason,
      }),
    onSuccess: () => {
      clearCurrentDelivery();
      setAvailabilityStatus('online');
      setIsSuccess(false);
      setErrorMessage(null);
      setShowInfoModal(true);
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      const msg = err?.response?.data?.message || 'Failed to report delivery failure.';
      setErrorMessage(msg);
    },
  });

  const handleConfirmHandover = () => {
    if (!canDeliver || deliverMutation.isPending) return;
    deliverMutation.mutate();
  };

  const handleConfirmFailure = () => {
    if (!canFail || failMutation.isPending) return;
    failMutation.mutate();
  };

  const handleCloseModal = () => {
    setShowInfoModal(false);
    navigation.navigate('DeliveryHome');
  };

  const isPending = deliverMutation.isPending || failMutation.isPending;

  return (
    <ScreenWrapper scrollable>
      <View style={styles.container}>
        {/* Header Icon */}
        <View style={styles.iconWrapper}>
          <View style={[styles.iconCircle, showFailureMode && styles.iconCircleFailed]}>
            <RNText style={styles.iconEmoji}>{showFailureMode ? '⚠️' : '📍'}</RNText>
          </View>
        </View>

        {/* Heading */}
        <RNText style={styles.heading}>
          {showFailureMode ? 'Report Delivery Failure' : 'Arrived at Customer'}
        </RNText>
        <RNText style={styles.subheading}>
          {showFailureMode
            ? 'State the reason why the packages could not be successfully handed over.'
            : 'Please complete the physical checklist steps to prepare packages for handover.'}
        </RNText>

        {/* Error Notification Banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <RNText style={styles.errorBannerText}>{errorMessage}</RNText>
          </View>
        )}

        {/* Assignment Metadata Card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <RNText style={styles.cardLabel}>Assignment ID</RNText>
            <RNText style={styles.cardValue} numberOfLines={1}>
              {assignmentId.slice(-8).toUpperCase()}
            </RNText>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <RNText style={styles.cardLabel}>Current Status</RNText>
            <View style={[styles.badgePurple, showFailureMode && styles.badgeRed]}>
              <RNText style={[styles.badgePurpleText, showFailureMode && styles.badgeRedText]}>
                {showFailureMode ? 'Arrived → Failure' : 'Arrived → Handover'}
              </RNText>
            </View>
          </View>
        </View>

        {/* ----------------- FAILURE MODE LAYOUT ----------------- */}
        {showFailureMode ? (
          <View style={styles.checklistCard}>
            <RNText style={styles.checklistTitle}>SELECT FAILURE REASON</RNText>
            
            {[
              'Customer not available',
              'Incorrect address',
              'Gate locked',
              'Refused by customer',
              'Other',
            ].map((reason) => (
              <TouchableOpacity
                key={reason}
                style={styles.radioRow}
                activeOpacity={0.8}
                onPress={() => setFailureReason(reason)}
              >
                <View
                  style={[
                    styles.radioOutline,
                    failureReason === reason && styles.radioOutlineActive,
                  ]}
                >
                  {failureReason === reason && <View style={styles.radioDot} />}
                </View>
                <RNText style={styles.radioText}>{reason}</RNText>
              </TouchableOpacity>
            ))}

            {failureReason === 'Other' && (
              <View style={styles.inputContainer}>
                <RNText style={styles.inputLabel}>Specify Reason</RNText>
                <TextInput
                  style={styles.textInput}
                  placeholder="Explain details of failure..."
                  placeholderTextColor="rgba(180, 195, 220, 0.4)"
                  value={customFailureReason}
                  onChangeText={setCustomFailureReason}
                />
              </View>
            )}
          </View>
        ) : (
          /* ----------------- SUCCESS HANDOVER LAYOUT ----------------- */
          <>
            {/* Checklist steps */}
            <View style={styles.checklistCard}>
              <RNText style={styles.checklistTitle}>
                HANDOVER STEPS <RNText style={styles.checklistRequired}>(Required)</RNText>
              </RNText>

              {/* Step 1 */}
              <TouchableOpacity
                style={styles.checkItemRow}
                activeOpacity={0.8}
                onPress={() => toggleCheck('countMatches')}
              >
                <View
                  style={[
                    styles.checkbox,
                    checkedItems.countMatches && styles.checkboxActive,
                  ]}
                >
                  {checkedItems.countMatches && (
                    <RNText style={styles.checkboxCheck}>✓</RNText>
                  )}
                </View>
                <View style={styles.checkTextContainer}>
                  <RNText style={styles.checkTextTitle}>Verify Package Count</RNText>
                  <RNText style={styles.checkTextDesc}>
                    Confirm package amount matches order list.
                  </RNText>
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />

              {/* Step 2 */}
              <TouchableOpacity
                style={styles.checkItemRow}
                activeOpacity={0.8}
                onPress={() => toggleCheck('handedOver')}
              >
                <View
                  style={[
                    styles.checkbox,
                    checkedItems.handedOver && styles.checkboxActive,
                  ]}
                >
                  {checkedItems.handedOver && (
                    <RNText style={styles.checkboxCheck}>✓</RNText>
                  )}
                </View>
                <View style={styles.checkTextContainer}>
                  <RNText style={styles.checkTextTitle}>Hand Over Packages</RNText>
                  <RNText style={styles.checkTextDesc}>
                    Collectively deliver all items to the customer.
                  </RNText>
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />

              {/* Step 3 */}
              <TouchableOpacity
                style={styles.checkItemRow}
                activeOpacity={0.8}
                onPress={() => toggleCheck('verificationReady')}
              >
                <View
                  style={[
                    styles.checkbox,
                    checkedItems.verificationReady && styles.checkboxActive,
                  ]}
                >
                  {checkedItems.verificationReady && (
                    <RNText style={styles.checkboxCheck}>✓</RNText>
                  )}
                </View>
                <View style={styles.checkTextContainer}>
                  <RNText style={styles.checkTextTitle}>Verify Handover Method</RNText>
                  <RNText style={styles.checkTextDesc}>
                    Acknowledge customer receipt verification.
                  </RNText>
                </View>
              </TouchableOpacity>
            </View>

            {/* Handover Verification Fields */}
            {isAllChecked && (
              <View style={styles.verificationCard}>
                <RNText style={styles.checklistTitle}>VERIFICATION METHOD</RNText>

                {/* Segmented Method Tabs */}
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      verificationMethod === 'otp' && styles.tabButtonActive,
                    ]}
                    onPress={() => setVerificationMethod('otp')}
                  >
                    <RNText
                      style={[
                        styles.tabButtonText,
                        verificationMethod === 'otp' && styles.tabButtonTextActive,
                      ]}
                    >
                      OTP Code
                    </RNText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      verificationMethod === 'manual' && styles.tabButtonActive,
                    ]}
                    onPress={() => setVerificationMethod('manual')}
                  >
                    <RNText
                      style={[
                        styles.tabButtonText,
                        verificationMethod === 'manual' && styles.tabButtonTextActive,
                      ]}
                    >
                      Manual Sign
                    </RNText>
                  </TouchableOpacity>
                </View>

                {verificationMethod === 'otp' ? (
                  <View style={styles.inputContainer}>
                    <RNText style={styles.inputLabel}>Customer Handover OTP</RNText>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter 6-digit PIN"
                      placeholderTextColor="rgba(180, 195, 220, 0.4)"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={otpCode}
                      onChangeText={setOtpCode}
                    />
                    <RNText style={styles.inputHelp}>
                      Ask customer for the verification PIN shown on their order.
                    </RNText>
                  </View>
                ) : (
                  <View style={styles.inputContainer}>
                    <RNText style={styles.inputLabel}>Handover Notes (Optional)</RNText>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      placeholder="e.g. Left packages at front porch with security."
                      placeholderTextColor="rgba(180, 195, 220, 0.4)"
                      multiline
                      numberOfLines={3}
                      value={deliveryNotes}
                      onChangeText={setDeliveryNotes}
                    />
                  </View>
                )}
              </View>
            )}
          </>
        )}

        {/* ----------------- ACTION CTAs ----------------- */}
        <View style={styles.ctaWrapper}>
          {showFailureMode ? (
            <>
              <Button
                title={isPending ? 'Reporting...' : 'Confirm Delivery Failure'}
                variant="danger"
                size="lg"
                disabled={!canFail || isPending}
                onPress={handleConfirmFailure}
              />
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => {
                  setShowFailureMode(false);
                  setErrorMessage(null);
                }}
              >
                <RNText style={styles.outlineBtnText}>Cancel & Go Back</RNText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Button
                title={isPending ? 'Delivering...' : 'Confirm Handover & Deliver'}
                variant="primary"
                size="lg"
                disabled={!canDeliver || isPending}
                onPress={handleConfirmHandover}
              />
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => {
                  setShowFailureMode(true);
                  setErrorMessage(null);
                }}
              >
                <RNText style={styles.outlineBtnTextDanger}>Report Delivery Failure</RNText>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Back Link to navigation */}
        <TouchableOpacity
          style={styles.backLink}
          disabled={isPending}
          onPress={() => navigation.goBack()}
        >
          <RNText style={styles.backLinkText}>← Back to active map</RNText>
        </TouchableOpacity>

        {/* ----------------- SUCCESS / FAILURE COMPLETION MODAL ----------------- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showInfoModal}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View
                  style={[
                    styles.modalIconWrapper,
                    !isSuccess && styles.modalIconWrapperFailed,
                  ]}
                >
                  <RNText style={styles.modalIconEmoji}>
                    {isSuccess ? '📦🎉' : '⚠️📁'}
                  </RNText>
                </View>
                
                <RNText style={styles.modalTitle}>
                  {isSuccess ? 'Delivery Completed!' : 'Failure Registered!'}
                </RNText>
                
                <RNText style={[styles.modalMessage, !isSuccess && styles.modalMessageFailed]}>
                  {isSuccess
                    ? 'Rider Released! Handover completed successfully.'
                    : 'Rider Released! Failure logged for dispatch review.'}
                </RNText>
                
                <RNText style={styles.modalInstruction}>
                  {isSuccess
                    ? 'The packages have been confirmed in delivered status. The corresponding order is completed, and you are ready for your next dispatch.'
                    : 'The packages have been returned to warehouse queue. The corresponding order status has transitioned to failed.'}
                </RNText>
                
                <View style={styles.modalButtonWrapper}>
                  <Button
                    title="Return to Dashboard"
                    variant="primary"
                    size="lg"
                    onPress={handleCloseModal}
                  />
                </View>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </View>
    </ScreenWrapper>
  );
}

// ---------------------------------------------------------------------------
// Styling Design Tokens
// ---------------------------------------------------------------------------

const DARK_BG = '#0D1526';
const CARD_BG = 'rgba(31, 45, 75, 0.85)';
const CARD_BORDER = 'rgba(60, 80, 120, 0.5)';
const PURPLE = '#8B5CF6';
const PURPLE_GLOW = 'rgba(139, 92, 246, 0.15)';
const RED = '#EF4444';
const RED_GLOW = 'rgba(239, 68, 68, 0.15)';
const INPUT_BG = 'rgba(20, 35, 65, 0.9)';
const INPUT_BORDER = 'rgba(80, 100, 140, 0.5)';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: DARK_BG,
    flex: 1,
    minHeight: '100%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  iconWrapper: {
    marginBottom: spacing.lg,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: PURPLE_GLOW,
    borderColor: PURPLE,
    borderRadius: 60,
    borderWidth: 2,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  iconCircleFailed: {
    backgroundColor: RED_GLOW,
    borderColor: RED,
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
  errorBanner: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: RED,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorBannerText: {
    color: '#FCA5A5',
    fontSize: typography.body,
    fontWeight: '600',
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
  badgePurple: {
    backgroundColor: PURPLE_GLOW,
    borderColor: PURPLE,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgePurpleText: {
    color: PURPLE,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  badgeRed: {
    backgroundColor: RED_GLOW,
    borderColor: RED,
  },
  badgeRedText: {
    color: RED,
  },
  checklistCard: {
    alignSelf: 'stretch',
    backgroundColor: CARD_BG,
    borderColor: CARD_BORDER,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  checklistTitle: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  checklistRequired: {
    color: 'rgba(180, 195, 220, 0.6)',
    fontWeight: '400',
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: INPUT_BORDER,
    backgroundColor: INPUT_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: PURPLE,
  },
  checkboxCheck: {
    color: PURPLE,
    fontWeight: '900',
    fontSize: 16,
  },
  checkTextContainer: {
    flex: 1,
  },
  checkTextTitle: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  checkTextDesc: {
    color: 'rgba(180, 195, 220, 0.6)',
    fontSize: typography.small,
  },
  verificationCard: {
    alignSelf: 'stretch',
    backgroundColor: CARD_BG,
    borderColor: CARD_BORDER,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 25, 45, 0.6)',
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.md,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: PURPLE,
    borderWidth: 1,
  },
  tabButtonText: {
    color: 'rgba(180, 195, 220, 0.6)',
    fontSize: typography.body,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    marginTop: spacing.sm,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: typography.caption,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  textInput: {
    backgroundColor: INPUT_BG,
    borderColor: INPUT_BORDER,
    borderWidth: 1,
    borderRadius: radius.md,
    color: '#FFFFFF',
    fontSize: typography.body,
    padding: spacing.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputHelp: {
    color: 'rgba(180, 195, 220, 0.5)',
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
  ctaWrapper: {
    alignSelf: 'stretch',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  outlineBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: CARD_BORDER,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  outlineBtnText: {
    color: 'rgba(180, 195, 220, 0.8)',
    fontSize: typography.body,
    fontWeight: '600',
  },
  outlineBtnTextDanger: {
    color: '#FCA3A3',
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

  // Radio button layout for failures
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  radioOutline: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: INPUT_BORDER,
    backgroundColor: INPUT_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOutlineActive: {
    borderColor: RED,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: RED,
  },
  radioText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '500',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContainer: {
    width: '88%',
    alignSelf: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderColor: CARD_BORDER,
    borderWidth: 1.5,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  modalIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PURPLE_GLOW,
    borderColor: PURPLE,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalIconWrapperFailed: {
    backgroundColor: RED_GLOW,
    borderColor: RED,
  },
  modalIconEmoji: {
    fontSize: 32,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: typography.h2,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalMessage: {
    color: colors.success,
    fontSize: typography.body,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalMessageFailed: {
    color: RED,
  },
  modalInstruction: {
    color: 'rgba(200, 215, 230, 0.75)',
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  modalButtonWrapper: {
    alignSelf: 'stretch',
  },
});
