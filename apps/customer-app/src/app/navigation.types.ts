export type AuthStackParamList = {
  Login: undefined;
  OtpVerification: {
    canResendAfter: number;
    challengeId: string;
    expiresIn: number;
    maskedTarget: string;
    phone: string;
    role: 'customer';
  };
};

import type { NavigatorScreenParams } from '@react-navigation/native';

import type { CatalogStackParamList } from '../modules/catalog/navigation/catalog-navigation.types';

export type MainStackParamList = {
  AuthSmokeTest: undefined;
  Catalog: NavigatorScreenParams<CatalogStackParamList> | undefined;
  Debug: undefined;
  Home: undefined;
  Profile: undefined;
  Sessions: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type CustomerAppRouteParamList = AuthStackParamList & MainStackParamList;
