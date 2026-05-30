import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getNewAssignmentAlertViewModel } from '../utils/new-assignment-alert.util';
import { DELIVERY_REALTIME_EVENTS } from '../types/delivery-realtime.types';

test('new assignment alert builds view model for assignment created event', () => {
  const viewModel = getNewAssignmentAlertViewModel({
    eventName: DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
    assignmentId: 'assignment-12345678',
    orderId: 'order-1',
    deliveryStatus: 'assigned',
    assignmentCode: 'DEL-100',
    pickupEta: null,
    updatedAt: '2026-01-01T10:00:00.000Z',
    emittedAt: null,
    eventId: null,
    assignment: null,
  });

  assert.deepEqual(viewModel, {
    assignmentLabel: 'DEL-100',
    orderId: 'order-1',
    pickupEtaLabel: 'Awaiting ETA',
    navigationTarget: 'DeliveryHome',
  });
});

test('new assignment alert falls back to assignment id suffix', () => {
  const viewModel = getNewAssignmentAlertViewModel({
    eventName: DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CREATED,
    assignmentId: 'assignment-abcdef12',
    orderId: 'order-1',
    deliveryStatus: 'assigned',
    assignmentCode: null,
    pickupEta: null,
    updatedAt: '2026-01-01T10:00:00.000Z',
    emittedAt: null,
    eventId: null,
    assignment: null,
  });

  assert.equal(viewModel?.assignmentLabel, 'ABCDEF12');
});

test('new assignment alert is hidden for cancellation events', () => {
  const viewModel = getNewAssignmentAlertViewModel({
    eventName: DELIVERY_REALTIME_EVENTS.ASSIGNMENT_CANCELLED,
    assignmentId: 'assignment-1',
    orderId: 'order-1',
    deliveryStatus: 'cancelled',
    assignmentCode: null,
    pickupEta: null,
    updatedAt: '2026-01-01T10:00:00.000Z',
    emittedAt: null,
    eventId: null,
    assignment: null,
  });

  assert.equal(viewModel, null);
});

