export const SUPPORT_TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const SUPPORT_TICKET_STATUSES = Object.values(SUPPORT_TICKET_STATUS);

export const SUPPORT_TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const SUPPORT_TICKET_PRIORITIES = Object.values(SUPPORT_TICKET_PRIORITY);

export const SUPPORT_TICKET_CATEGORY = {
  ORDER: 'order',
  PAYMENT: 'payment',
  DELIVERY: 'delivery',
  ACCOUNT: 'account',
  GENERAL: 'general',
} as const;

export const SUPPORT_TICKET_CATEGORIES = Object.values(SUPPORT_TICKET_CATEGORY);

export const SUPPORT_TICKET_SOURCE = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  SYSTEM: 'system',
} as const;

export const SUPPORT_TICKET_SOURCES = Object.values(SUPPORT_TICKET_SOURCE);

export const SUPPORT_TICKET_NOTE_TYPE = {
  NOTE: 'note',
  STATUS_CHANGE: 'status_change',
  ASSIGNMENT: 'assignment',
} as const;

export const SUPPORT_TICKET_NOTE_TYPES = Object.values(SUPPORT_TICKET_NOTE_TYPE);

export const SUPPORT_TICKET_DEFAULT_PAGE = 1;
export const SUPPORT_TICKET_DEFAULT_LIMIT = 20;
export const SUPPORT_TICKET_MAX_LIMIT = 100;
