import React from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity, View } from 'react-native';

import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { useDeliveryRealtimeStore } from '../store/delivery-realtime.store';
import { getNewAssignmentAlertViewModel } from '../utils/new-assignment-alert.util';

export function NewAssignmentAlert() {
  const navigation = useAppNavigation();
  const lastAssignmentEvent = useDeliveryRealtimeStore(
    (state) => state.lastAssignmentEvent,
  );

  const viewModel = getNewAssignmentAlertViewModel(lastAssignmentEvent);

  if (!viewModel) {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={() => navigation.navigate(viewModel.navigationTarget)}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <RNText style={styles.title}>New delivery assigned</RNText>
        <RNText style={styles.action}>Open</RNText>
      </View>
      <View style={styles.detailRow}>
        <RNText style={styles.label}>Assignment</RNText>
        <RNText style={styles.value}>{viewModel.assignmentLabel}</RNText>
      </View>
      <View style={styles.detailRow}>
        <RNText style={styles.label}>Order</RNText>
        <RNText style={styles.value}>{viewModel.orderId}</RNText>
      </View>
      <View style={styles.detailRow}>
        <RNText style={styles.label}>Pickup ETA</RNText>
        <RNText style={styles.value}>
          {viewModel.pickupEtaLabel}
        </RNText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  action: {
    color: '#22C55E',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: 'rgba(22, 163, 74, 0.14)',
    borderColor: 'rgba(34, 197, 94, 0.55)',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: 'rgba(226, 232, 240, 0.72)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  value: {
    color: '#FFFFFF',
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 12,
    textAlign: 'right',
  },
});
