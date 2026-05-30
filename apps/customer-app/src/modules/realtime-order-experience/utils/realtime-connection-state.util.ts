export const toRealtimeConnectionErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Realtime connection failed';
};

export const isRealtimeAuthSocketFailure = (value: unknown): boolean => {
  const message = toRealtimeConnectionErrorMessage(value).toLowerCase();
  return (
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('invalid_socket_token') ||
    message.includes('invalid token') ||
    message.includes('auth')
  );
};

export const getRealtimeRoomsToRestore = (activeOrderRooms: string[]): string[] =>
  activeOrderRooms.filter((orderId) => orderId.trim().length > 0);
