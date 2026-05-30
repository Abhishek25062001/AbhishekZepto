export type AuthStackParamList = {
  Login: undefined;
  OtpVerification: {
    canResendAfter: number;
    challengeId: string;
    expiresIn: number;
    maskedTarget: string;
    phone: string;
    role: 'delivery_agent';
  };
};

export type MainStackParamList = {
  AuthSmokeTest: undefined;
  DeliveryHome: undefined;
  ActiveDelivery: { assignmentId: string };
  NotificationCenter: undefined;
  Debug: undefined;
  Profile: undefined;
  Sessions: undefined;
  StoreArrival: { assignmentId: string };
  PickupConfirmation: { assignmentId: string };
  CustomerArrival: { assignmentId: string };
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type DeliveryAgentAppRouteParamList = AuthStackParamList &
  MainStackParamList;
