export type AdminControlLiveOverview = {
  activeOrders: number;
  lateOrders: number;
  activeAgents: number;
  offlineAgents: number;
  forceClosedStores: number;
  slaBreaches: number;
};

export type AdminControlLiveOrder = {
  orderId: string;
  orderNumber: string;
  storeId: string;
  customerId: string;
  orderStatus: string;
  slaStatus: string | null;
  slaBreachedStage: string | null;
  updatedAt: string;
};

export type AdminControlLiveAgent = {
  agentId: string;
  cityId: string | null;
  location: null;
  availability: string;
  batteryLevel: null;
  activeOrderCount: number;
  updatedAt: string;
};

export type AdminControlLiveStore = {
  storeId: string;
  cityId: string;
  queueLoad: number;
  preparationDelay: null;
  acceptanceRate: null;
  forceCloseStatus: string | null;
  isOpen: boolean;
  isAcceptingOrders: boolean;
  updatedAt: string;
};

export type AdminControlEscalation = {
  escalationId: string;
  orderId: string;
  assignmentId: string;
  cityId: string;
  escalationLevel: number | null;
  escalationReason: string | null;
  escalatedAt: string | null;
  slaBreachedStage: string | null;
};
