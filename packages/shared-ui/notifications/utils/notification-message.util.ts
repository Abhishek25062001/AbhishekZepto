export const truncateNotificationMessage = (
  message: string,
  maxLength = 96,
): string => {
  const normalizedMessage = message.trim();
  if (normalizedMessage.length <= maxLength) {
    return normalizedMessage;
  }

  return `${normalizedMessage.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
};
