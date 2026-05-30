import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDeliveryStore } from '../store/delivery.store';
import { useAuthStore } from '../store/auth.store';
import { useDeliveryRealtimeStore } from '../modules/realtime-operations/store/delivery-realtime.store';
import {
  fetchAgentAvailabilityStatus,
  updateAgentAvailabilityStatus,
  fetchAgentProfile,
} from '../services/api/delivery.api';
import type { DeliveryAgentProfile, DeliveryAgentStatus } from '../types/delivery.types';

export function useDeliveryStatusQuery() {
  const deliveryAgentId = useAuthStore((state) => state.deliveryAgentId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentStatus = useDeliveryStore((state) => state.availabilityStatus);
  const socketConnected = useDeliveryRealtimeStore((state) => state.socketConnected);

  const query = useQuery<DeliveryAgentStatus>({
    queryKey: ['delivery-status', deliveryAgentId],
    queryFn: async () => {
      const response = await fetchAgentAvailabilityStatus();
      return response.data;
    },
    enabled: isAuthenticated && Boolean(deliveryAgentId),
    refetchInterval:
      isAuthenticated &&
      !socketConnected &&
      (currentStatus === 'online' || currentStatus === 'busy')
        ? 5000
        : false,
  });

  // Sync with Zustand store when data changes
  useEffect(() => {
    if (query.data) {
      useDeliveryStore.setState({
        availabilityStatus: query.data.availabilityStatus,
        currentAssignmentId: query.data.currentAssignmentId,
      });
    }
  }, [query.data]);

  return query;
}

export function useDeliveryProfileQuery() {
  const deliveryAgentId = useAuthStore((state) => state.deliveryAgentId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<DeliveryAgentProfile>({
    queryKey: ['delivery-profile', deliveryAgentId],
    queryFn: async () => {
      const response = await fetchAgentProfile();
      return response.data;
    },
    enabled: isAuthenticated && Boolean(deliveryAgentId),
  });
}

export function useUpdateAvailabilityMutation() {
  const queryClient = useQueryClient();
  const deliveryAgentId = useAuthStore((state) => state.deliveryAgentId);

  return useMutation<
    DeliveryAgentProfile,
    unknown,
    'online' | 'offline',
    { previousStatus: 'online' | 'offline' | 'busy' }
  >({
    mutationFn: async (status: 'online' | 'offline') => {
      const response = await updateAgentAvailabilityStatus(status);
      return response.data;
    },
    onMutate: async (newStatus) => {
      // Cancel outgoing status queries so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['delivery-status', deliveryAgentId] });

      // Snapshot the current status
      const previousStatus = useDeliveryStore.getState().availabilityStatus;

      // Optimistically update the store status
      useDeliveryStore.setState({ availabilityStatus: newStatus });

      return { previousStatus };
    },
    onError: (err, newStatus, context) => {
      // Rollback to previous status on error
      if (context?.previousStatus) {
        useDeliveryStore.setState({ availabilityStatus: context.previousStatus });
      }
    },
    onSuccess: (data) => {
      // Set the actual status returned from the server
      if (data) {
        useDeliveryStore.setState({
          availabilityStatus: data.availabilityStatus,
          currentAssignmentId: data.currentAssignmentId,
        });
      }
    },
    onSettled: () => {
      // Invalidate queries to sync with actual server state
      queryClient.invalidateQueries({ queryKey: ['delivery-status', deliveryAgentId] });
      queryClient.invalidateQueries({ queryKey: ['delivery-profile', deliveryAgentId] });
    },
  });
}
