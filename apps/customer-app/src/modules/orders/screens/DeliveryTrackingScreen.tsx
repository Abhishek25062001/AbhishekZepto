import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text as RNText,
  View,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { colors, radius, spacing } from '../../../theme';
import { Loader, ScreenWrapper, Text } from '../../../components/common';
import type { MainStackParamList } from '../../../app/navigation.types';
import { RealtimeConnectionBanner } from '../../realtime-order-experience/components/RealtimeConnectionBanner';
import { RealtimeDeliveryTracker } from '../../realtime-order-experience/components/RealtimeDeliveryTracker';
import { useRealtimeOrderRoom } from '../../realtime-order-experience/hooks/useRealtimeOrderRoom';
import { useRealtimeOrderStore } from '../../realtime-order-experience/store/realtime-order.store';
import { useOrderDelivery } from '../hooks/useOrderDelivery';
import { useOrderDetail } from '../hooks/useOrderDetail';

type DeliveryTrackingRouteProp = RouteProp<MainStackParamList, 'DeliveryTracking'>;

export function DeliveryTrackingScreen() {
  const route = useRoute<DeliveryTrackingRouteProp>();
  const orderId = route.params.orderId;
  useRealtimeOrderRoom(orderId);

  const { isLoading: orderLoading } = useOrderDetail(orderId);
  const { delivery, isLoading: trackingLoading } = useOrderDelivery(orderId);
  const latestRealtimeDeliveryEvent = useRealtimeOrderStore((state) =>
    [...state.deliveryTrackingEvents]
      .reverse()
      .find((event) => event.orderId === orderId),
  );
  const currentDeliveryStatus =
    latestRealtimeDeliveryEvent?.progressStatus || delivery?.deliveryStatus || null;
  const hasActiveDelivery = Boolean(delivery || latestRealtimeDeliveryEvent);

  // Animated values for pulsing dot and transit path simulation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const transitProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation looping
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 2,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    if (currentDeliveryStatus) {
      // Set transition progress based on current delivery status
      let targetValue = 0;
      const status = currentDeliveryStatus;

      if (status === 'assigned' || status === 'en_route_to_store') {
        targetValue = 0.25;
      } else if (status === 'arrived_at_store') {
        targetValue = 0.45;
      } else if (status === 'picked_up' || status === 'en_route_to_customer') {
        targetValue = 0.7;
      } else if (status === 'arrived_at_customer') {
        targetValue = 0.9;
      } else if (status === 'delivered') {
        targetValue = 1.0;
      }

      Animated.timing(transitProgress, {
        toValue: targetValue,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }
  }, [currentDeliveryStatus, transitProgress]);

  const handleCallRider = (phone: string) => {
    void Linking.openURL(`tel:${phone}`);
  };

  if (orderLoading || trackingLoading) {
    return (
      <ScreenWrapper>
        <Loader />
      </ScreenWrapper>
    );
  }

  // Active status helper
  const getStepStatus = (step: string): 'completed' | 'active' | 'pending' => {
    if (!currentDeliveryStatus) {
      return step === 'prepared' ? 'active' : 'pending';
    }

    const currentStatus = currentDeliveryStatus;

    if (step === 'prepared') {
      return 'completed';
    }

    if (step === 'assigned') {
      const activeStates = [
        'assigned',
        'en_route_to_store',
        'arrived_at_store',
        'picked_up',
        'en_route_to_customer',
        'arrived_at_customer',
        'delivered',
      ];
      if (currentStatus === 'assigned') return 'active';
      return activeStates.includes(currentStatus) ? 'completed' : 'pending';
    }

    if (step === 'picked_up') {
      const activeStates = ['picked_up', 'en_route_to_customer', 'arrived_at_customer', 'delivered'];
      if (currentStatus === 'picked_up') return 'active';
      return activeStates.includes(currentStatus) ? 'completed' : 'pending';
    }

    if (step === 'en_route') {
      const activeStates = ['en_route_to_customer', 'arrived_at_customer', 'delivered'];
      if (currentStatus === 'en_route_to_customer') return 'active';
      return activeStates.includes(currentStatus) ? 'completed' : 'pending';
    }

    if (step === 'arrived') {
      const activeStates = ['arrived_at_customer', 'delivered'];
      if (currentStatus === 'arrived_at_customer') return 'active';
      return activeStates.includes(currentStatus) ? 'completed' : 'pending';
    }

    if (step === 'delivered') {
      return currentStatus === 'delivered' ? 'completed' : 'pending';
    }

    return 'pending';
  };

  const getStepColor = (status: 'completed' | 'active' | 'pending') => {
    if (status === 'completed') return colors.success;
    if (status === 'active') return colors.primary;
    return colors.textDisabled;
  };

  // Interpolating the moving dot position along the canvas path
  const riderDotX = transitProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['15%', '85%'],
  });

  const riderDotY = transitProgress.interpolate({
    inputRange: [0, 0.4, 0.7, 1],
    outputRange: [120, 60, 140, 80],
  });

  return (
    <ScreenWrapper scrollable={false}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Mock Map Canvas Frame */}
        <View style={styles.mapCanvas}>
          {/* Mesh Grid Lines */}
          <View style={styles.gridOverlay} />
          
          {/* Store Pin Marker */}
          <View style={[styles.markerPin, { left: '15%', top: 120 }]}>
            <View style={[styles.pinDot, { backgroundColor: colors.info }]} />
            <RNText style={styles.pinLabel}>Zepto Store</RNText>
          </View>

          {/* Dotted path route */}
          <View style={styles.routeLine} />

          {/* Animated Rider Pulsing Dot */}
          {hasActiveDelivery && (
            <Animated.View style={[styles.riderDotContainer, { left: riderDotX, top: riderDotY }]}>
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 2],
                      outputRange: [0.6, 0],
                    }),
                  },
                ]}
              />
              <View style={styles.riderDot} />
            </Animated.View>
          )}

          {/* Customer Pin Marker */}
          <View style={[styles.markerPin, { left: '85%', top: 80 }]}>
            <View style={[styles.pinDot, { backgroundColor: colors.success }]} />
            <RNText style={styles.pinLabel}>You</RNText>
          </View>

          {!hasActiveDelivery && (
            <View style={styles.scanningContainer}>
              <Animated.View
                style={[
                  styles.scanRing,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
              <RNText style={styles.scanText}>Matching nearby riders...</RNText>
            </View>
          )}
        </View>

        <RealtimeConnectionBanner />

        <RealtimeDeliveryTracker orderId={orderId} pollingDelivery={delivery} />

        {/* Status Stepper Tracker */}
        <View style={styles.stepperCard}>
          <RNText style={styles.cardTitle}>Delivery Stages</RNText>
          
          <View style={styles.stepsList}>
            {/* Step 1: Order Prepared */}
            <View style={styles.stepRow}>
              <View style={[styles.stepIndicator, { borderColor: getStepColor(getStepStatus('prepared')) }]}>
                {getStepStatus('prepared') === 'completed' && <View style={[styles.stepDot, { backgroundColor: colors.success }]} />}
              </View>
              <View style={styles.stepInfo}>
                <RNText style={[styles.stepTitle, { color: getStepColor(getStepStatus('prepared')) }]}>Order Prepared</RNText>
                <Text variant="small" color="secondary">Your items are packed and sealed.</Text>
              </View>
            </View>

            {/* Step 2: Rider Assigned */}
            <View style={styles.stepRow}>
              <View style={[styles.stepIndicator, { borderColor: getStepColor(getStepStatus('assigned')) }]}>
                {getStepStatus('assigned') === 'completed' && <View style={[styles.stepDot, { backgroundColor: colors.success }]} />}
                {getStepStatus('assigned') === 'active' && <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />}
              </View>
              <View style={styles.stepInfo}>
                <RNText style={[styles.stepTitle, { color: getStepColor(getStepStatus('assigned')) }]}>Rider Assigned</RNText>
                <Text variant="small" color="secondary">Rider is assigned and moving to store.</Text>
              </View>
            </View>

            {/* Step 3: Order Picked Up */}
            <View style={styles.stepRow}>
              <View style={[styles.stepIndicator, { borderColor: getStepColor(getStepStatus('picked_up')) }]}>
                {getStepStatus('picked_up') === 'completed' && <View style={[styles.stepDot, { backgroundColor: colors.success }]} />}
                {getStepStatus('picked_up') === 'active' && <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />}
              </View>
              <View style={styles.stepInfo}>
                <RNText style={[styles.stepTitle, { color: getStepColor(getStepStatus('picked_up')) }]}>Picked Up</RNText>
                <Text variant="small" color="secondary">Rider picked up order from Zepto Store.</Text>
              </View>
            </View>

            {/* Step 4: En Route to Customer */}
            <View style={styles.stepRow}>
              <View style={[styles.stepIndicator, { borderColor: getStepColor(getStepStatus('en_route')) }]}>
                {getStepStatus('en_route') === 'completed' && <View style={[styles.stepDot, { backgroundColor: colors.success }]} />}
                {getStepStatus('en_route') === 'active' && <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />}
              </View>
              <View style={styles.stepInfo}>
                <RNText style={[styles.stepTitle, { color: getStepColor(getStepStatus('en_route')) }]}>En Route</RNText>
                <Text variant="small" color="secondary">Rider is heading directly to your location.</Text>
              </View>
            </View>

            {/* Step 5: Arrived */}
            <View style={styles.stepRow}>
              <View style={[styles.stepIndicator, { borderColor: getStepColor(getStepStatus('arrived')) }]}>
                {getStepStatus('arrived') === 'completed' && <View style={[styles.stepDot, { backgroundColor: colors.success }]} />}
                {getStepStatus('arrived') === 'active' && <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />}
              </View>
              <View style={styles.stepInfo}>
                <RNText style={[styles.stepTitle, { color: getStepColor(getStepStatus('arrived')) }]}>Arrived</RNText>
                <Text variant="small" color="secondary">Rider is at your doorstep.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rider Profile Snapshot Card */}
        {delivery && delivery.riderProfile ? (
          <View style={styles.riderCard}>
            <View style={styles.riderMeta}>
              <View style={styles.riderAvatarPlaceholder}>
                <RNText style={styles.avatarText}>
                  {delivery.riderProfile.name.charAt(0).toUpperCase()}
                </RNText>
              </View>
              <View style={styles.riderDetails}>
                <Text variant="h3">{delivery.riderProfile.name}</Text>
                <Text variant="small" color="secondary">
                  {delivery.riderProfile.vehicleType.toUpperCase()} • {delivery.riderProfile.vehicleNumber ?? 'No vehicle number'}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCallRider(delivery.riderProfile!.phone)}
            >
              <RNText style={styles.callButtonText}>📞 Call Rider</RNText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.waitingCard}>
            <Text variant="h3">Preparing your delivery</Text>
            <Text variant="small" color="secondary">
              Riders in your area are checking the dispatch queue. Hold tight!
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  mapCanvas: {
    backgroundColor: '#0a0d14',
    height: 220,
    borderRadius: radius.lg,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderStyle: 'dashed',
  },
  markerPin: {
    position: 'absolute',
    alignItems: 'center',
    width: 100,
    marginLeft: -50,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  pinLabel: {
    color: '#94a3b8',
    marginTop: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  routeLine: {
    position: 'absolute',
    left: '15%',
    right: '15%',
    top: 100,
    height: 2,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  riderDotContainer: {
    position: 'absolute',
    width: 24,
    height: 24,
    marginLeft: -12,
    marginTop: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7c3aed',
    borderWidth: 2,
    borderColor: '#ffffff',
    zIndex: 2,
  },
  pulseRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7c3aed',
    zIndex: 1,
  },
  scanningContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#7c3aed',
    opacity: 0.4,
  },
  scanText: {
    color: '#94a3b8',
    marginTop: 12,
  },
  stepperCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    marginBottom: spacing.md,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  stepsList: {
    gap: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  stepIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginTop: 2,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  riderCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  riderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  riderAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  riderDetails: {
    justifyContent: 'center',
  },
  callButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  callButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  waitingCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
});
