import {
  registerNotificationEventSubscriber,
  unregisterNotificationEventSubscriber,
} from '../subscribers/notification-event.subscriber';
import {
  registerRealtimeEventSubscriber,
  unregisterRealtimeEventSubscriber,
} from '../subscribers/realtime-event.subscriber';
import {
  registerOrderRealtimeSubscriber,
  unregisterOrderRealtimeSubscriber,
} from '../../realtime-order-updates/subscribers/order-realtime.subscriber';
import {
  registerDeliveryTrackingRealtimeSubscriber,
  unregisterDeliveryTrackingRealtimeSubscriber,
} from '../../realtime-delivery-tracking/subscribers/delivery-tracking-realtime.subscriber';
import {
  registerPushNotificationSubscriber,
  unregisterPushNotificationSubscriber,
} from '../../push-notifications/subscribers/push-notification.subscriber';
import {
  registerInAppNotificationSubscriber,
  unregisterInAppNotificationSubscriber,
} from '../../in-app-notifications/subscribers/in-app-notification.subscriber';

let internalEventSubscribersRegistered = false;

export const registerInternalEventSubscribers = (): void => {
  if (internalEventSubscribersRegistered) {
    return;
  }

  registerRealtimeEventSubscriber();
  registerNotificationEventSubscriber();
  registerOrderRealtimeSubscriber();
  registerDeliveryTrackingRealtimeSubscriber();
  registerPushNotificationSubscriber();
  registerInAppNotificationSubscriber();
  internalEventSubscribersRegistered = true;
};

export const areInternalEventSubscribersRegistered = (): boolean =>
  internalEventSubscribersRegistered;

export const resetInternalEventSubscriberRegistryForTests = (): void => {
  unregisterRealtimeEventSubscriber();
  unregisterNotificationEventSubscriber();
  unregisterOrderRealtimeSubscriber();
  unregisterDeliveryTrackingRealtimeSubscriber();
  unregisterPushNotificationSubscriber();
  unregisterInAppNotificationSubscriber();
  internalEventSubscribersRegistered = false;
};
