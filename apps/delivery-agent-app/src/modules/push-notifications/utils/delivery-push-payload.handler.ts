import type {
  DeliveryPushDataPayload,
  DeliveryPushNavigation,
} from '../types/delivery-push.types';

const getAssignmentId = (payload: DeliveryPushDataPayload): string | null =>
  typeof payload.assignmentId === 'string' && payload.assignmentId.trim()
    ? payload.assignmentId.trim()
    : null;

export const handleDeliveryPushPayload = (
  payload: DeliveryPushDataPayload,
  navigation: DeliveryPushNavigation,
): boolean => {
  const assignmentId = getAssignmentId(payload);

  if (payload.type === 'assignment_created' && assignmentId) {
    navigation.navigate('ActiveDelivery', { assignmentId });
    return true;
  }

  navigation.navigate('DeliveryHome');
  return false;
};
