import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useRoute, type RouteProp } from '@react-navigation/native';

import { Button, ScreenWrapper } from '../../components/common';
import { useDeliveryAssignmentRoom } from '../../modules/realtime-operations/hooks/useDeliveryAssignmentRoom';
import { useDeliveryLocationSync } from '../../modules/realtime-operations/hooks/useDeliveryLocationSync';
import { useDeliveryStore } from '../../store/delivery.store';
import {
  markEnRouteToCustomer,
  markArrivedAtCustomer,
} from '../../services/api/delivery.api';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { colors, radius, spacing, typography } from '../../theme';
import type { MainStackParamList } from '../../app/navigation.types';

type ActiveDeliveryRouteProp = RouteProp<MainStackParamList, 'ActiveDelivery'>;

export function ActiveDeliveryScreen() {
  const route = useRoute<ActiveDeliveryRouteProp>();
  const { assignmentId } = route.params;
  const navigation = useAppNavigation();
  useDeliveryAssignmentRoom(assignmentId);
  const { locationSyncError } = useDeliveryLocationSync();

  const currentDeliveryStatus = useDeliveryStore(
    (state) => state.currentDeliveryStatus,
  );
  const setCurrentDeliveryStatus = useDeliveryStore(
    (state) => state.setCurrentDeliveryStatus,
  );

  // Pulsing animation for active rider node or status dots
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (currentDeliveryStatus === 'arrived_at_customer') {
      navigation.navigate('CustomerArrival', { assignmentId });
    }
  }, [assignmentId, currentDeliveryStatus, navigation]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Mutations
  const enRouteMutation = useMutation({
    mutationFn: () => markEnRouteToCustomer(assignmentId),
    onSuccess: () => {
      setCurrentDeliveryStatus('en_route_to_customer');
    },
  });

  const arrivedMutation = useMutation({
    mutationFn: () => markArrivedAtCustomer(assignmentId),
    onSuccess: () => {
      setCurrentDeliveryStatus('arrived_at_customer');
      navigation.navigate('CustomerArrival', { assignmentId });
    },
  });

  const isPending = enRouteMutation.isPending || arrivedMutation.isPending;
  const isError = enRouteMutation.isError || arrivedMutation.isError;

  // ---------------------------------------------------------------------------
  // View 1: Picked Up State -> Awaiting departure confirmation
  // ---------------------------------------------------------------------------
  if (currentDeliveryStatus === 'picked_up') {
    return (
      <ScreenWrapper scrollable>
        <View style={styles.container}>
          {/* Animated package cargo box */}
          <Animated.View style={[styles.iconWrapper, { opacity: pulseAnim }]}>
            <View style={styles.iconCircle}>
              <RNText style={styles.iconEmoji}>📦</RNText>
            </View>
          </Animated.View>

          {/* Header */}
          <RNText style={styles.heading}>Package Collected!</RNText>
          <RNText style={styles.subheading}>
            You have successfully picked up all order packages. Let's start the
            active journey.
          </RNText>

          {/* Info Card */}
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <RNText style={styles.cardLabel}>Assignment ID</RNText>
              <RNText style={styles.cardValue} numberOfLines={1}>
                {assignmentId.slice(-8).toUpperCase()}
              </RNText>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <RNText style={styles.cardLabel}>Task</RNText>
              <View style={[styles.badge, styles.badgeGreen]}>
                <RNText style={styles.badgeGreenText}>Depart Store</RNText>
              </View>
            </View>
          </View>

          {/* Error message */}
          {isError && (
            <View style={styles.errorBox}>
              <RNText style={styles.errorText}>
                Failed to update status. Please try again.
              </RNText>
            </View>
          )}

          {/* CTA */}
          <View style={styles.ctaWrapper}>
            {isPending ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={GREEN} />
                <RNText style={styles.loadingText}>Departing store…</RNText>
              </View>
            ) : (
              <Button
                title="Depart Store & Start Navigation"
                variant="primary"
                size="lg"
                onPress={() => enRouteMutation.mutate()}
              />
            )}
          </View>

          {/* Back link */}
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => navigation.navigate('DeliveryHome')}
            disabled={isPending}
          >
            <RNText style={styles.backLinkText}>← Back to Dashboard</RNText>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  // ---------------------------------------------------------------------------
  // View 2: En Route State -> Active transit & mock navigation map
  // ---------------------------------------------------------------------------
  return (
    <ScreenWrapper scrollable>
      <View style={styles.container}>
        {/* Mock Map Preview Frame */}
        <View style={styles.mapFrame}>
          <RNText style={styles.mapGridTitle}>⚡ LIVE TRANSIT PREVIEW</RNText>
          <View style={styles.mapCanvas}>
            {/* Store Node */}
            <View style={[styles.mapNode, styles.nodeStore]}>
              <RNText style={styles.nodeEmoji}>🏪</RNText>
              <RNText style={styles.nodeLabel}>Store</RNText>
            </View>

            {/* Trail */}
            <View style={styles.mapTrail} />

            {/* Rider Node */}
            <Animated.View
              style={[
                styles.mapNode,
                styles.nodeRider,
                { opacity: pulseAnim },
              ]}
            >
              <RNText style={styles.nodeEmoji}>🚴</RNText>
            </Animated.View>

            {/* Customer Node */}
            <View style={[styles.mapNode, styles.nodeCustomer]}>
              <RNText style={styles.nodeEmoji}>🏡</RNText>
              <RNText style={styles.nodeLabel}>Customer</RNText>
            </View>
          </View>
        </View>

        {/* Header */}
        <View style={styles.statusHeaderRow}>
          <RNText style={styles.headingEnRoute}>En Route to Customer</RNText>
          <Animated.View
            style={[styles.pulsingDot, { opacity: pulseAnim }]}
          />
        </View>
        <RNText style={styles.subheadingTransit}>
          Navigate to the customer delivery address and hand over packages.
        </RNText>

        {/* Customer Details Glass Card */}
        <View style={styles.customerCard}>
          <RNText style={styles.customerCardHeader}>👤 CUSTOMER INFO</RNText>

          <View style={styles.customerRow}>
            <RNText style={styles.customerLabel}>Customer Name</RNText>
            <RNText style={styles.customerValue}>Shivam Chowdhry</RNText>
          </View>
          <View style={styles.divider} />

          <View style={styles.customerRow}>
            <RNText style={styles.customerLabel}>Delivery Address</RNText>
            <RNText style={styles.customerAddressValue}>
              123 Indiranagar Main Road, Bangalore
            </RNText>
          </View>
          <View style={styles.divider} />

          <View style={styles.customerRow}>
            <RNText style={styles.customerLabel}>Instructions</RNText>
            <RNText style={styles.customerInstructionValue}>
              Leave at gate if door is locked.
            </RNText>
          </View>

          <TouchableOpacity style={styles.callButton} activeOpacity={0.8}>
            <RNText style={styles.callButtonText}>📞 Call Customer</RNText>
          </TouchableOpacity>
        </View>

        {/* Error message */}
        {isError && (
          <View style={styles.errorBox}>
            <RNText style={styles.errorText}>
              Failed to register arrival. Please try again.
            </RNText>
          </View>
        )}

        {locationSyncError ? (
          <View style={styles.errorBox}>
            <RNText style={styles.errorText}>{locationSyncError}</RNText>
          </View>
        ) : null}

        {/* CTA */}
        <View style={styles.ctaWrapper}>
          {isPending ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={PURPLE} />
              <RNText style={styles.loadingTextArrived}>
                Registering customer arrival…
              </RNText>
            </View>
          ) : (
            <Button
              title="I've Arrived at Customer"
              variant="primary"
              size="lg"
              onPress={() => arrivedMutation.mutate()}
            />
          )}
        </View>

        {/* Back link */}
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate('DeliveryHome')}
          disabled={isPending}
        >
          <RNText style={styles.backLinkText}>← Back to Dashboard</RNText>
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
const PURPLE = '#8B5CF6';
const PURPLE_GLOW = 'rgba(139, 92, 246, 0.15)';

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
    marginBottom: spacing.xl,
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
  badge: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeGreen: {
    backgroundColor: GREEN_GLOW,
    borderColor: GREEN,
  },
  badgeGreenText: {
    color: GREEN,
    fontSize: typography.caption,
    fontWeight: '600',
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
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
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

  // ---------------------------------------------------------------------------
  // Transit & Mock Map styles
  // ---------------------------------------------------------------------------
  mapFrame: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(20, 32, 58, 0.85)',
    borderColor: CARD_BORDER,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  mapGridTitle: {
    color: 'rgba(180, 195, 220, 0.6)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  mapCanvas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.sm,
    height: 110,
    position: 'relative',
  },
  mapTrail: {
    position: 'absolute',
    left: 45,
    right: 45,
    height: 3,
    backgroundColor: 'rgba(100, 120, 150, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  mapNode: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    backgroundColor: 'rgba(15, 25, 45, 0.95)',
    zIndex: 2,
  },
  nodeStore: {
    borderColor: GREEN,
    backgroundColor: GREEN_GLOW,
  },
  nodeRider: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  nodeCustomer: {
    borderColor: PURPLE,
    backgroundColor: PURPLE_GLOW,
  },
  nodeEmoji: {
    fontSize: 22,
  },
  nodeLabel: {
    position: 'absolute',
    bottom: -22,
    color: 'rgba(180, 195, 220, 0.7)',
    fontSize: 10,
    fontWeight: '600',
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  headingEnRoute: {
    color: '#FFFFFF',
    fontSize: typography.h2,
    fontWeight: '700',
  },
  pulsingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GREEN,
  },
  subheadingTransit: {
    color: 'rgba(180, 195, 220, 0.75)',
    fontSize: typography.body,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },

  // Customer Card
  customerCard: {
    alignSelf: 'stretch',
    backgroundColor: CARD_BG,
    borderColor: CARD_BORDER,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  customerCardHeader: {
    color: 'rgba(180, 195, 220, 0.6)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  customerRow: {
    paddingVertical: spacing.md,
  },
  customerLabel: {
    color: 'rgba(180, 195, 220, 0.6)',
    fontSize: typography.caption,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  customerValue: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '700',
  },
  customerAddressValue: {
    color: '#F3F4F6',
    fontSize: typography.body,
    fontWeight: '500',
    lineHeight: 20,
  },
  customerInstructionValue: {
    color: '#FBBF24',
    fontSize: typography.body,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  callButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3B82F6',
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  callButtonText: {
    color: '#3B82F6',
    fontSize: typography.body,
    fontWeight: '600',
  },
  loadingTextArrived: {
    color: PURPLE,
    fontSize: typography.body,
    fontWeight: '600',
  },
});
