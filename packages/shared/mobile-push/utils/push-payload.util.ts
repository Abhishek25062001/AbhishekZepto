import { MOBILE_PUSH_PAYLOAD_TYPE } from '../constants/push.constants';
import type {
  AssignmentCreatedPushDataPayload,
  DeliveryFailedPushDataPayload,
  OrderDeliveredPushDataPayload,
  OrderOutForDeliveryPushDataPayload,
  PushNotificationDataPayload,
} from '../types/push.types';

export const isAssignmentCreatedPushPayload = (
  payload: PushNotificationDataPayload,
): payload is AssignmentCreatedPushDataPayload =>
  payload.type === MOBILE_PUSH_PAYLOAD_TYPE.ASSIGNMENT_CREATED;

export const isOrderOutForDeliveryPushPayload = (
  payload: PushNotificationDataPayload,
): payload is OrderOutForDeliveryPushDataPayload =>
  payload.type === MOBILE_PUSH_PAYLOAD_TYPE.ORDER_OUT_FOR_DELIVERY;

export const isOrderDeliveredPushPayload = (
  payload: PushNotificationDataPayload,
): payload is OrderDeliveredPushDataPayload =>
  payload.type === MOBILE_PUSH_PAYLOAD_TYPE.ORDER_DELIVERED;

export const isDeliveryFailedPushPayload = (
  payload: PushNotificationDataPayload,
): payload is DeliveryFailedPushDataPayload =>
  payload.type === MOBILE_PUSH_PAYLOAD_TYPE.DELIVERY_FAILED;
