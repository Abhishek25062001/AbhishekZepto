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
import { useDeliveryStore } from '../../store/delivery.store';
import { markArrivedAtStore } from '../../services/api/delivery.api';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { colors, radius, spacing, typography } from '../../theme';
import type { MainStackParamList } from '../../app/navigation.types';

type StoreArrivalRouteProp = RouteProp<MainStackParamList, 'StoreArrival'>;

export function StoreArrivalScreen() {
  const route = useRoute<StoreArrivalRouteProp>();
  const { assignmentId } = route.params;
  const navigation = useAppNavigation();
  const setCurrentDeliveryStatus = useDeliveryStore(
    (state) => state.setCurrentDeliveryStatus,
  );

  // Pulsing glow animation for the store icon
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [glowAnim]);

  const mutation = useMutation({
    mutationFn: () => markArrivedAtStore(assignmentId),
    onSuccess: () => {
      setCurrentDeliveryStatus('arrived_at_store');
      navigation.navigate('PickupConfirmation', { assignmentId });
    },
  });

  return (
    <ScreenWrapper scrollable>
      <View style={styles.container}>
        {/* Animated store icon */}
        <Animated.View style={[styles.iconWrapper, { opacity: glowAnim }]}>
          <View style={styles.iconCircle}>
            <RNText style={styles.iconEmoji}>🏪</RNText>
          </View>
        </Animated.View>

        {/* Header */}
        <RNText style={styles.heading}>You're at the Store</RNText>
        <RNText style={styles.subheading}>
          Confirm your arrival to let the store team know you're ready to pick
          up the order.
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
            <View style={styles.badge}>
              <RNText style={styles.badgeText}>En Route → Arrived</RNText>
            </View>
          </View>
        </View>

        {/* Error message */}
        {mutation.isError && (
          <View style={styles.errorBox}>
            <RNText style={styles.errorText}>
              Failed to register arrival. Please try again.
            </RNText>
          </View>
        )}

        {/* CTA */}
        <View style={styles.ctaWrapper}>
          {mutation.isPending ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={AMBER} />
              <RNText style={styles.loadingText}>Registering arrival…</RNText>
            </View>
          ) : (
            <Button
              title="Confirm Store Arrival"
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
const AMBER = '#F59E0B';
const AMBER_GLOW = 'rgba(245, 158, 11, 0.15)';

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
    backgroundColor: AMBER_GLOW,
    borderColor: AMBER,
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
    backgroundColor: AMBER_GLOW,
    borderColor: AMBER,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: AMBER,
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
    color: AMBER,
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
