import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { DeliveryAgentAppRouteParamList } from '../app/navigation.types';

export function useAppNavigation() {
  return useNavigation<
    NativeStackNavigationProp<DeliveryAgentAppRouteParamList>
  >();
}

