import React, { useState } from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity, View } from 'react-native';

import { useDeliveryStore } from '../../../store/delivery.store';
import { useDeliveryRealtimeStore } from '../store/delivery-realtime.store';
import { DELIVERY_REALTIME_EVENTS } from '../types/delivery-realtime.types';

export function AssignmentCancelledAlert() {
  const [acknowledgedEventId, setAcknowledgedEventId] = useState<string | null>(null);
  const clearCurrentDelivery = useDeliveryStore((state) => state.clearCurrentDelivery);
  const lastAssignmentEvent = useDeliveryRealtimeStore(
    (state) => state.lastAssignmentEvent,
  );

  if (
    !lastAssignmentEvent ||
    lastAssignmentEvent.eventName !== DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED
  ) {
    return null;
  }

  const eventKey =
    lastAssignmentEvent.eventId ??
    `${lastAssignmentEvent.assignmentId}:${lastAssignmentEvent.updatedAt}`;
  if (acknowledgedEventId === eventKey) {
    return null;
  }

  return (
    <View style={styles.card}>
      <RNText style={styles.title}>Assignment cancelled</RNText>
      <RNText style={styles.body}>
        Assignment {lastAssignmentEvent.assignmentId.slice(-8).toUpperCase()} is no
        longer active.
      </RNText>
      <TouchableOpacity
        activeOpacity={0.86}
        onPress={() => {
          clearCurrentDelivery();
          setAcknowledgedEventId(eventKey);
        }}
        style={styles.button}
      >
        <RNText style={styles.buttonText}>Acknowledge</RNText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    color: 'rgba(254, 226, 226, 0.85)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: 'rgba(220, 38, 38, 0.16)',
    borderColor: 'rgba(220, 38, 38, 0.55)',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
});
