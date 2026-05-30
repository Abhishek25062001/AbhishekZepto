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

import type { AddressesStackParamList } from '../modules/addresses/navigation/addresses.navigation';
import type { CatalogStackParamList } from '../modules/catalog/navigation/catalog-navigation.types';

export type MainStackParamList = {
  AuthSmokeTest: undefined;
  Addresses: NavigatorScreenParams<AddressesStackParamList> | undefined;
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };
  OrderDetail: { orderId: string };
  DeliveryTracking: { orderId: string };
  NotificationCenter: undefined;
  OrderHistory: undefined;
  Catalog: NavigatorScreenParams<CatalogStackParamList> | undefined;
  Debug: undefined;
  DevHome: undefined;
  Home: undefined;
  LocationGate: undefined;
  Profile: undefined;
  Sessions: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type CustomerAppRouteParamList = AuthStackParamList & MainStackParamList;
