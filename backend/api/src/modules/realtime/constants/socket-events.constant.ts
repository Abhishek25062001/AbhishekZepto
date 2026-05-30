export const SOCKET_EVENTS = {
  CONNECTION_AUTHENTICATED: 'connection.authenticated',
  CONNECTION_ERROR: 'connection.error',
  CONNECTION_DISCONNECTED: 'connection.disconnected',

  ROOM_JOINED: 'room.joined',
  ROOM_LEFT: 'room.left',
  ROOM_JOIN_DENIED: 'room.join_denied',

  DELIVERY_ASSIGNMENT_CREATED: 'delivery.assignment_created',
  DELIVERY_LOCATION_UPDATED: 'delivery.location_updated',
  DELIVERY_STATUS_UPDATED: 'delivery.status_updated',
} as const;

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
