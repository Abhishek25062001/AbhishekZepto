export type AuthStackParamList = {
  Login: undefined;
};

export type MainStackParamList = {
  DeliveryHome: undefined;
  ActiveDelivery: undefined;
  Debug: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type DeliveryAgentAppRouteParamList = AuthStackParamList &
  MainStackParamList;
