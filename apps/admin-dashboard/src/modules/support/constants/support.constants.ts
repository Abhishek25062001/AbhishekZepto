export const SUPPORT_TICKET_STATUS_OPTIONS = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
] as const;

export const SUPPORT_TICKET_PRIORITY_OPTIONS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
] as const;

export const SUPPORT_TICKET_CATEGORY_OPTIONS = [
  { label: 'Order', value: 'order' },
  { label: 'Payment', value: 'payment' },
  { label: 'Delivery', value: 'delivery' },
  { label: 'Account', value: 'account' },
  { label: 'General', value: 'general' },
] as const;
