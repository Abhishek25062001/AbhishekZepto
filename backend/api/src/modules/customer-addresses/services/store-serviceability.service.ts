import { Types } from 'mongoose';
import {
  findActiveStoresForServiceability,
  findStoreById,
} from '../../stores/repositories/store.repository';
import type { StoreRecord } from '../../stores/models/store.model';
import { serviceabilityUnavailableError } from '../utils/customer-address-error.mapper';
import { haversineDistanceKm } from '../utils/haversine-distance.util';
import type { ServiceabilityResult } from '../types/customer-address.types';

type ServiceableCandidate = {
  store: StoreRecord & { _id: Types.ObjectId };
  distanceKm: number;
};

export const findNearestServiceableStore = async (input: {
  latitude: number;
  longitude: number;
  cityId?: string | null;
}): Promise<ServiceabilityResult> => {
  const stores = await findActiveStoresForServiceability(input.cityId ?? undefined);

  const candidates: ServiceableCandidate[] = stores
    .map((store) => ({
      store,
      distanceKm: haversineDistanceKm(
        input.latitude,
        input.longitude,
        store.latitude,
        store.longitude,
      ),
    }))
    .filter((candidate) => candidate.distanceKm <= candidate.store.serviceRadiusKm);

  if (candidates.length === 0) {
    throw serviceabilityUnavailableError();
  }

  candidates.sort((left, right) => left.distanceKm - right.distanceKm);
  const nearest = candidates[0]!;

  return {
    storeId: nearest.store._id.toString(),
    storeName: nearest.store.name,
    cityId: nearest.store.cityId.toString(),
    distanceKm: Number(nearest.distanceKm.toFixed(3)),
  };
};

export const isStoreServiceableForCoordinates = async (input: {
  storeId: string;
  latitude: number;
  longitude: number;
}): Promise<boolean> => {
  const store = await findStoreById(input.storeId);

  if (!store || store.status !== 'active' || !store.isOpen || !store.isAcceptingOrders) {
    return false;
  }

  const distanceKm = haversineDistanceKm(
    input.latitude,
    input.longitude,
    store.latitude,
    store.longitude,
  );

  return distanceKm <= store.serviceRadiusKm;
};
