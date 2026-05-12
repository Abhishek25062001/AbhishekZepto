export type AuthStackParamList = {
  Login: undefined;
};

export type MainStackParamList = {
  Debug: undefined;
  Home: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type CustomerAppRouteParamList = AuthStackParamList & MainStackParamList;
