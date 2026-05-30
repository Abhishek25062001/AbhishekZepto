import { useQuery } from '@tanstack/react-query';

import { useAdminRealtimeStore } from '../store/admin-realtime.store';
import type { AdminControlTowerSnapshotQuery } from '../types/control-tower-realtime.types';
import { getControlTowerSnapshot } from '../services/control-tower.api';

export const useControlTowerSnapshot = (
  query: AdminControlTowerSnapshotQuery = {},
) => {
  const socketConnected = useAdminRealtimeStore((state) => state.socketConnected);

  return useQuery({
    queryKey: ['admin-control-tower-snapshot', query],
    queryFn: () => getControlTowerSnapshot(query),
    refetchInterval: socketConnected ? false : 10000,
  });
};
