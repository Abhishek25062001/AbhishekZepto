import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Text as RNText,
} from 'react-native';

import { ErrorView, Loader, ScreenWrapper, Button } from '../../components/common';
import { isDevelopment } from '../../config/env';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { useAuthStore } from '../../store/auth.store';
import { useDeliveryStore } from '../../store/delivery.store';
import {
  useDeliveryStatusQuery,
  useDeliveryProfileQuery,
  useUpdateAvailabilityMutation,
} from '../../hooks/useDeliveryStatus';
import { AssignmentCancelledAlert } from '../../modules/realtime-operations/components/AssignmentCancelledAlert';
import { DeliveryRealtimeConnectionBanner } from '../../modules/realtime-operations/components/DeliveryRealtimeConnectionBanner';
import { NewAssignmentAlert } from '../../modules/realtime-operations/components/NewAssignmentAlert';
import { useDeliveryAssignmentRoom } from '../../modules/realtime-operations/hooks/useDeliveryAssignmentRoom';
import { NotificationBell } from '../../modules/notification-center/components/NotificationBell';
import { colors, radius, spacing, typography } from '../../theme';

export function DeliveryHomeScreen() {
  const navigation = useAppNavigation();
  const deliveryAgentId = useAuthStore((state) => state.deliveryAgentId);
  const authCityId = useAuthStore((state) => state.cityId);
  const role = useAuthStore((state) => state.role);
  
  const { healthData, isLoading: isHealthLoading, error: healthError } = useBackendHealth();

  // Queries and mutations
  const { isLoading: isStatusLoading, error: statusError } = useDeliveryStatusQuery();
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useDeliveryProfileQuery();
  const updateStatusMutation = useUpdateAvailabilityMutation();

  const storeStatus = useDeliveryStore((state) => state.availabilityStatus);
  const storeAssignmentId = useDeliveryStore((state) => state.currentAssignmentId);
  const storeDeliveryStatus = useDeliveryStore((state) => state.currentDeliveryStatus);
  useDeliveryAssignmentRoom(storeAssignmentId);

  const [showIncompleteModal, setShowIncompleteModal] = useState(false);

  const handleToggleStatus = async () => {
    if (updateStatusMutation.isPending) return;

    if (storeStatus === 'online' || storeStatus === 'busy') {
      // Toggle to offline (always allowed)
      try {
        await updateStatusMutation.mutateAsync('offline');
      } catch (err) {
        console.error('Failed to go offline:', err);
      }
    } else {
      // Check completeness before attempting to go online
      const isComplete =
        profile &&
        profile.cityId &&
        profile.vehicleNumber &&
        profile.isVerified &&
        profile.isActive;

      if (!isComplete) {
        setShowIncompleteModal(true);
        return;
      }

      // Toggle to online
      try {
        await updateStatusMutation.mutateAsync('online');
      } catch (err) {
        console.error('Failed to go online:', err);
      }
    }
  };

  if (isStatusLoading || isProfileLoading) {
    return (
      <ScreenWrapper scrollable={false}>
        <View style={styles.loadingContainer}>
          <Loader />
          <RNText style={[styles.baseText, styles.loadingText]}>
            Syncing agent profile & state...
          </RNText>
        </View>
      </ScreenWrapper>
    );
  }

  if (statusError || profileError) {
    return (
      <ScreenWrapper scrollable={false}>
        <ErrorView message="Failed to sync delivery agent credentials. Please check your network connection." />
      </ScreenWrapper>
    );
  }

  // Completeness check variables
  const hasCity = Boolean(profile?.cityId);
  const hasVehicle = Boolean(profile?.vehicleNumber);
  const isVerified = Boolean(profile?.isVerified);
  const isActive = Boolean(profile?.isActive);
  const isProfileComplete = hasCity && hasVehicle && isVerified && isActive;

  // Dynamic styling states for the presence toggle container
  let statusColor = '#374151'; // offline gray
  let statusLabel = 'OFFLINE';
  let statusSubtitle = 'Go online to receive order assignments';

  if (storeStatus === 'online') {
    statusColor = '#16A34A'; // success green
    statusLabel = 'ONLINE';
    statusSubtitle = 'Ready to accept orders';
  } else if (storeStatus === 'busy' || storeAssignmentId) {
    statusColor = '#D97706'; // busy gold-yellow
    statusLabel = 'ON DUTY';
    statusSubtitle = 'Delivery in progress';
  }

  return (
    <ScreenWrapper scrollable={true} backgroundColor="#111827">
      <View style={styles.header}>
        <RNText style={[styles.baseText, styles.appTitle]}>
          ⚡ Zepto Delivery
        </RNText>
        <NotificationBell onPress={() => navigation.navigate('NotificationCenter')} />
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <RNText style={styles.badgeText}>{statusLabel}</RNText>
        </View>
      </View>

      <DeliveryRealtimeConnectionBanner />
      <NewAssignmentAlert />
      <AssignmentCancelledAlert />

      {/* Elegant Interactive Availability Toggle */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleToggleStatus}
        style={[
          styles.statusCard,
          {
            borderColor: statusColor,
            shadowColor: statusColor,
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
          },
        ]}
      >
        <View style={styles.statusRow}>
          <View style={styles.statusInfo}>
            <RNText style={[styles.baseText, styles.statusMainLabel]}>
              {statusLabel === 'ONLINE' ? '🟢 Going Live' : statusLabel === 'ON DUTY' ? '🟡 Actively Assigned' : '⚪ Currently Offline'}
            </RNText>
            <RNText style={[styles.baseText, styles.statusSubtitle]}>
              {statusSubtitle}
            </RNText>
          </View>
          
          {/* Switch UI Track */}
          <View
            style={[
              styles.switchTrack,
              {
                backgroundColor:
                  storeStatus === 'online'
                    ? 'rgba(22, 163, 74, 0.2)'
                    : storeStatus === 'busy'
                    ? 'rgba(217, 119, 6, 0.2)'
                    : 'rgba(75, 85, 99, 0.3)',
              },
            ]}
          >
            {updateStatusMutation.isPending ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <View
                style={[
                  styles.switchThumb,
                  {
                    backgroundColor: statusColor,
                    alignSelf: storeStatus === 'online' || storeStatus === 'busy' ? 'flex-end' : 'flex-start',
                  },
                ]}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Active Assignment Card — shown when an assignment is in progress */}
      {storeAssignmentId && (
        <View style={styles.assignmentCard}>
          <RNText style={[styles.baseText, styles.cardHeader]}>
            🚚 Active Assignment
          </RNText>
          <View style={styles.assignmentRow}>
            <RNText style={[styles.baseText, styles.detailLabel]}>
              Assignment ID
            </RNText>
            <RNText style={[styles.baseText, styles.detailValue]}>
              {storeAssignmentId.slice(-8).toUpperCase()}
            </RNText>
          </View>
          <View style={styles.assignmentRow}>
            <RNText style={[styles.baseText, styles.detailLabel]}>Status</RNText>
            <RNText style={[styles.baseText, styles.assignmentStatus]}>
              {storeDeliveryStatus
                ? storeDeliveryStatus.replace(/_/g, ' ').toUpperCase()
                : 'UNKNOWN'}
            </RNText>
          </View>

          {/* Context-sensitive action button */}
          {storeDeliveryStatus === 'en_route_to_store' && (
            <TouchableOpacity
              style={styles.assignmentActionBtn}
              onPress={() =>
                navigation.navigate('StoreArrival', {
                  assignmentId: storeAssignmentId,
                })
              }
            >
              <RNText style={styles.assignmentActionText}>
                🏪 I've Arrived at Store →
              </RNText>
            </TouchableOpacity>
          )}

          {storeDeliveryStatus === 'arrived_at_store' && (
            <TouchableOpacity
              style={[styles.assignmentActionBtn, styles.assignmentActionBtnGreen]}
              onPress={() =>
                navigation.navigate('PickupConfirmation', {
                  assignmentId: storeAssignmentId,
                })
              }
            >
              <RNText style={styles.assignmentActionText}>
                📦 Confirm Package Pickup →
              </RNText>
            </TouchableOpacity>
          )}

          {storeDeliveryStatus === 'picked_up' && (
            <TouchableOpacity
              style={[styles.assignmentActionBtn, styles.assignmentActionBtnPurple]}
              onPress={() =>
                navigation.navigate('ActiveDelivery', {
                  assignmentId: storeAssignmentId,
                })
              }
            >
              <RNText style={styles.assignmentActionText}>
                🚴 Depart Store & Start Navigation →
              </RNText>
            </TouchableOpacity>
          )}

          {storeDeliveryStatus === 'en_route_to_customer' && (
            <TouchableOpacity
              style={[styles.assignmentActionBtn, styles.assignmentActionBtnPurple]}
              onPress={() =>
                navigation.navigate('ActiveDelivery', {
                  assignmentId: storeAssignmentId,
                })
              }
            >
              <RNText style={styles.assignmentActionText}>
                🚴 View Active Route Progress →
              </RNText>
            </TouchableOpacity>
          )}

          {storeDeliveryStatus === 'arrived_at_customer' && (
            <TouchableOpacity
              style={[styles.assignmentActionBtn, styles.assignmentActionBtnPurple]}
              onPress={() =>
                navigation.navigate('CustomerArrival', {
                  assignmentId: storeAssignmentId,
                })
              }
            >
              <RNText style={styles.assignmentActionText}>
                🏡 Confirm Handover →
              </RNText>
            </TouchableOpacity>
          )}

          {storeDeliveryStatus &&
            storeDeliveryStatus !== 'en_route_to_store' &&
            storeDeliveryStatus !== 'arrived_at_store' &&
            storeDeliveryStatus !== 'picked_up' &&
            storeDeliveryStatus !== 'en_route_to_customer' &&
            storeDeliveryStatus !== 'arrived_at_customer' && (
              <View style={styles.assignmentInfoRow}>
                <RNText style={[styles.baseText, styles.assignmentInfoText]}>
                  Delivery progress will be shown in the next screen.
                </RNText>
              </View>
            )}
        </View>
      )}

      {/* Profile Summary & Completeness Card */}

      <View style={styles.profileCard}>
        <RNText style={[styles.baseText, styles.cardHeader]}>
          👤 Driver Profile Checklist
        </RNText>

        <View style={styles.profileDetailRow}>
          <RNText style={[styles.baseText, styles.detailLabel]}>Name</RNText>
          <RNText style={[styles.baseText, styles.detailValue]}>{profile?.name ?? 'Not set'}</RNText>
        </View>

        <View style={styles.profileDetailRow}>
          <RNText style={[styles.baseText, styles.detailLabel]}>Phone</RNText>
          <RNText style={[styles.baseText, styles.detailValue]}>{profile?.phone ?? 'Not set'}</RNText>
        </View>

        <View style={styles.divider} />

        <RNText style={[styles.baseText, styles.checklistSectionTitle]}>
          COMPLETENESS CHECKLIST
        </RNText>

        {/* City Allocation Requirement */}
        <View style={styles.checklistItem}>
          <RNText style={styles.checkIcon}>{hasCity ? '✅' : '❌'}</RNText>
          <View style={styles.checkTextContainer}>
            <RNText style={[styles.baseText, styles.checkTitle]}>City Allocation</RNText>
            <RNText style={[styles.baseText, styles.checkDesc]}>
              {hasCity ? `Assigned to city ID: ${profile?.cityId}` : 'No operating city allocated'}
            </RNText>
          </View>
        </View>

        {/* Registered Vehicle Requirement */}
        <View style={styles.checklistItem}>
          <RNText style={styles.checkIcon}>{hasVehicle ? '✅' : '❌'}</RNText>
          <View style={styles.checkTextContainer}>
            <RNText style={[styles.baseText, styles.checkTitle]}>Registered Vehicle</RNText>
            <RNText style={[styles.baseText, styles.checkDesc]}>
              {hasVehicle
                ? `Vehicle: ${profile?.vehicleType.toUpperCase()} (${profile?.vehicleNumber})`
                : 'Vehicle registration number is missing'}
            </RNText>
          </View>
        </View>

        {/* Admin Verification Requirement */}
        <View style={styles.checklistItem}>
          <RNText style={styles.checkIcon}>{isVerified ? '✅' : '❌'}</RNText>
          <View style={styles.checkTextContainer}>
            <RNText style={[styles.baseText, styles.checkTitle]}>Admin Verification</RNText>
            <RNText style={[styles.baseText, styles.checkDesc]}>
              {isVerified ? 'Profile verified by admin' : 'Awaiting profile document verification'}
            </RNText>
          </View>
        </View>

        {/* Agent Active Requirement */}
        <View style={styles.checklistItem}>
          <RNText style={styles.checkIcon}>{isActive ? '✅' : '❌'}</RNText>
          <View style={styles.checkTextContainer}>
            <RNText style={[styles.baseText, styles.checkTitle]}>Account Status</RNText>
            <RNText style={[styles.baseText, styles.checkDesc]}>
              {isActive ? 'Account is active' : 'Account is currently suspended/inactive'}
            </RNText>
          </View>
        </View>

        {!isProfileComplete ? (
          <View style={styles.incompleteWarningCard}>
            <RNText style={[styles.baseText, styles.incompleteWarningText]}>
              ⚠️ Your profile is incomplete. You cannot go online until all checklist items are resolved.
            </RNText>
          </View>
        ) : (
          <View style={styles.completeSuccessCard}>
            <RNText style={[styles.baseText, styles.completeSuccessText]}>
              🎉 All documents verified! You are fully eligible to accept order dispatches.
            </RNText>
          </View>
        )}
      </View>

      {/* Navigation Shortcuts */}
      <View style={styles.navigationPanel}>
        <View style={styles.navButtonWrapper}>
          <Button
            onPress={() => navigation.navigate('Profile')}
            title="✏️ Profile"
            variant="secondary"
          />
        </View>
        <View style={styles.navButtonWrapper}>
          <Button
            onPress={() => navigation.navigate('Sessions')}
            title="🔑 Sessions"
            variant="secondary"
          />
        </View>
      </View>

      {/* Developer and Health Panels */}
      {isDevelopment ? (
        <View style={styles.healthPanel}>
          <RNText style={[styles.baseText, styles.healthHeader]}>🛠️ System Diagnostics</RNText>
          <RNText style={[styles.baseText, styles.healthText]}>
            Agent Session ID: {deliveryAgentId ? `${deliveryAgentId.slice(0, 8)}...` : 'N/A'}
          </RNText>
          <RNText style={[styles.baseText, styles.healthText]}>
            Auth Token City ID: {authCityId ?? 'N/A'}
          </RNText>
          <RNText style={[styles.baseText, styles.healthText]}>
            Access Role Scope: {role ?? 'N/A'}
          </RNText>
          
          <View style={styles.divider} />
          
          <RNText style={[styles.baseText, styles.healthSubHeader]}>BACKEND HEALTH API</RNText>
          {isHealthLoading ? <ActivityIndicator size="small" color={colors.primary} /> : null}
          {healthError ? <RNText style={[styles.baseText, styles.healthText, { color: colors.error }]}>Backend offline</RNText> : null}
          {healthData ? (
            <RNText style={[styles.baseText, styles.healthText, { color: colors.success }]}>
              ● {healthData.service} ({healthData.status.toUpperCase()})
            </RNText>
          ) : null}
          
          <View style={styles.smokeButtonWrapper}>
            <Button
              onPress={() => navigation.navigate('AuthSmokeTest')}
              title="🔍 Launch Session Smoke Tests"
              variant="ghost"
            />
          </View>
        </View>
      ) : null}

      {/* Incomplete Profile Bottom Sheet / Modal Dialog */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showIncompleteModal}
        onRequestClose={() => setShowIncompleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <RNText style={[styles.baseText, styles.modalTitle]}>
                ⚠️ Verification Required
              </RNText>
              <RNText style={[styles.baseText, styles.modalSubtitle]}>
                Please resolve the following missing requirements before toggling online status:
              </RNText>

              <View style={styles.modalChecklist}>
                {!hasCity && (
                  <RNText style={[styles.baseText, styles.modalCheckItem, { color: colors.error }]}>
                    • Missing Operating City Allocation
                  </RNText>
                )}
                {!hasVehicle && (
                  <RNText style={[styles.baseText, styles.modalCheckItem, { color: colors.error }]}>
                    • Missing Registered Vehicle Details
                  </RNText>
                )}
                {!isVerified && (
                  <RNText style={[styles.baseText, styles.modalCheckItem, { color: colors.error }]}>
                    • Awaiting Admin Document Verification
                  </RNText>
                )}
                {!isActive && (
                  <RNText style={[styles.baseText, styles.modalCheckItem, { color: colors.error }]}>
                    • Account is currently Deactivated
                  </RNText>
                )}
              </View>

              <RNText style={[styles.baseText, styles.modalInstruction]}>
                You can resolve vehicle number and details directly in your profile configuration screen.
              </RNText>

              <View style={styles.modalActions}>
                <View style={styles.modalActionButtonWrapper}>
                  <Button
                    onPress={() => {
                      setShowIncompleteModal(false);
                      navigation.navigate('Profile');
                    }}
                    title="Go to Profile Settings"
                    variant="primary"
                  />
                </View>
                <View style={styles.modalActionButtonWrapper}>
                  <Button
                    onPress={() => setShowIncompleteModal(false)}
                    title="Close"
                    variant="secondary"
                  />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  appTitle: {
    fontSize: typography.h2,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  statusCard: {
    borderWidth: 2,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusMainLabel: {
    fontSize: typography.h3,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  statusSubtitle: {
    fontSize: typography.small,
    color: '#9CA3AF',
  },
  switchTrack: {
    width: 60,
    height: 34,
    borderRadius: 17,
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  profileCard: {
    backgroundColor: '#1F2937',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    fontSize: typography.h3,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  profileDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  detailLabel: {
    color: '#9CA3AF',
  },
  detailValue: {
    color: '#F9FAFB',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: spacing.md,
  },
  checklistSectionTitle: {
    fontSize: typography.small,
    color: '#9CA3AF',
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  checkTextContainer: {
    flex: 1,
  },
  checkTitle: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  checkDesc: {
    fontSize: typography.caption,
    color: '#9CA3AF',
  },
  incompleteWarningCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  incompleteWarningText: {
    fontSize: typography.small,
    color: '#FCA5A5',
  },
  completeSuccessCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  completeSuccessText: {
    fontSize: typography.small,
    color: '#A7F3D0',
  },
  navigationPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  navButtonWrapper: {
    flex: 1,
  },
  healthPanel: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  healthHeader: {
    fontSize: typography.h3,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  healthSubHeader: {
    fontSize: typography.small,
    color: '#9CA3AF',
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  healthText: {
    fontSize: typography.small,
    color: '#9CA3AF',
  },
  smokeButtonWrapper: {
    marginTop: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#374151',
  },
  modalContent: {
    padding: spacing.xl,
  },
  modalTitle: {
    fontSize: typography.h3,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  modalSubtitle: {
    color: '#E5E7EB',
    marginBottom: spacing.md,
  },
  modalChecklist: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  modalCheckItem: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalInstruction: {
    fontSize: typography.small,
    color: '#9CA3AF',
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  modalActionButtonWrapper: {
    width: '100%',
  },
  // Active Assignment Card (Module 7)
  assignmentCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    borderColor: '#D97706',
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  assignmentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  assignmentStatus: {
    color: '#F59E0B',
    fontSize: typography.small,
    fontWeight: '700',
  },
  assignmentActionBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#F59E0B',
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  assignmentActionBtnGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E',
  },
  assignmentActionBtnPurple: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: '#8B5CF6',
  },
  assignmentActionText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '700',
  },
  assignmentInfoRow: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  assignmentInfoText: {
    color: 'rgba(180, 195, 220, 0.6)',
    fontSize: typography.small,
    textAlign: 'center',
  },
});
