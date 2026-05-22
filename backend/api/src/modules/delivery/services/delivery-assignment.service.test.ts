/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Types } from 'mongoose';
import { DeliveryAgentModel } from '../models/delivery-agent.model';
import { DeliveryAssignmentModel } from '../models/delivery-assignment.model';
import * as repositoryModule from '../repositories/delivery-assignment.repository';
import * as orderRepositoryModule from '../../orders/repositories/order.repository';
import * as storeRepositoryModule from '../../stores/repositories/store.repository';
import {
  initializeDeliveryForOrder,
  runDispatchEngineForOrder,
  runDispatchEngineForAgent,
  markArrivedAtStore,
  markPickedUp,
} from './delivery-assignment.service';

import * as notificationModule from './delivery-notification.service';
import type { IDeliveryAssignmentDocument } from '../types/delivery-assignment.types';

// Helper fixtures
const orderId = new Types.ObjectId();
const customerId = new Types.ObjectId();
const storeId = new Types.ObjectId();
const cityId = new Types.ObjectId();
const deliveryId = new Types.ObjectId();
const agentId = new Types.ObjectId();

const makeDeliveryDoc = (overrides: Partial<IDeliveryAssignmentDocument> = {}): IDeliveryAssignmentDocument => ({
  _id: deliveryId,
  orderId,
  customerId,
  storeId,
  cityId,
  deliveryAgentId: null,
  deliveryStatus: 'pending_assignment',
  assignedAt: null,
  pickedUpAt: null,
  completedAt: null,
  cancelledAt: null,
  cancellationReason: null,
  timeline: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
} as unknown as IDeliveryAssignmentDocument);

test('initializeDeliveryForOrder creates new assignment if none exists', async () => {
  const originalFindByOrder = repositoryModule.findDeliveryAssignmentByOrderId;
  const originalFindOrder = orderRepositoryModule.findOrderById;
  const originalFindStore = storeRepositoryModule.findStoreById;
  const originalCreate = repositoryModule.createDeliveryAssignment;

  const repo = repositoryModule as unknown as {
    findDeliveryAssignmentByOrderId: typeof repositoryModule.findDeliveryAssignmentByOrderId;
    createDeliveryAssignment: typeof repositoryModule.createDeliveryAssignment;
  };
  const orderRepo = orderRepositoryModule as unknown as {
    findOrderById: typeof orderRepositoryModule.findOrderById;
  };
  const storeRepo = storeRepositoryModule as unknown as {
    findStoreById: typeof storeRepositoryModule.findStoreById;
  };

  try {
    repo.findDeliveryAssignmentByOrderId = async () => null;
    orderRepo.findOrderById = async () => ({
      _id: orderId,
      customerId,
      storeId,
    } as any);
    storeRepo.findStoreById = async () => ({
      _id: storeId,
      cityId,
    } as any);
    repo.createDeliveryAssignment = async (payload: any) => ({
      ...payload,
      _id: deliveryId,
      deliveryStatus: 'pending_assignment',
    } as any);

    const result = await initializeDeliveryForOrder(orderId);
    assert.ok(result);
    assert.equal(result.deliveryStatus, 'pending_assignment');
    assert.equal(result.orderId.toString(), orderId.toString());
    assert.equal(result.cityId.toString(), cityId.toString());
  } finally {
    repo.findDeliveryAssignmentByOrderId = originalFindByOrder;
    orderRepo.findOrderById = originalFindOrder;
    storeRepo.findStoreById = originalFindStore;
    repo.createDeliveryAssignment = originalCreate;
  }
});

test('initializeDeliveryForOrder returns existing assignment if present', async () => {
  const originalFindByOrder = repositoryModule.findDeliveryAssignmentByOrderId;
  const repo = repositoryModule as unknown as {
    findDeliveryAssignmentByOrderId: typeof repositoryModule.findDeliveryAssignmentByOrderId;
  };

  try {
    const existing = makeDeliveryDoc();
    repo.findDeliveryAssignmentByOrderId = async () => existing;

    const result = await initializeDeliveryForOrder(orderId);
    assert.ok(result);
    assert.equal(result._id.toString(), deliveryId.toString());
  } finally {
    repo.findDeliveryAssignmentByOrderId = originalFindByOrder;
  }
});

test('runDispatchEngineForOrder assigns oldest-idle online verified agent in same city', async () => {
  const originalFindById = repositoryModule.findDeliveryAssignmentById;
  const originalAgentFind = DeliveryAgentModel.find;
  const originalAgentFindOneAndUpdate = DeliveryAgentModel.findOneAndUpdate;
  const originalAssignmentFindOneAndUpdate = DeliveryAssignmentModel.findOneAndUpdate;
  const originalPublish = notificationModule.publishDeliveryNotificationPlaceholders;

  const repo = repositoryModule as unknown as {
    findDeliveryAssignmentById: typeof repositoryModule.findDeliveryAssignmentById;
  };
  const notifications = notificationModule as unknown as {
    publishDeliveryNotificationPlaceholders: typeof notificationModule.publishDeliveryNotificationPlaceholders;
  };

  try {
    notifications.publishDeliveryNotificationPlaceholders = async () => {};
    const delivery = makeDeliveryDoc();
    repo.findDeliveryAssignmentById = async () => delivery;

    // Mock DeliveryAgentModel.find to return eligible agents
    DeliveryAgentModel.find = () => {
      return {
        sort: () => {
          return {
            limit: () => {
              return {
                exec: async () => [
                  { _id: agentId, name: 'Oldest Idle Agent', cityId },
                ],
              };
            },
          };
        },
      } as any;
    };

    // Mock DeliveryAgentModel.findOneAndUpdate (Optimistic Lock Success)
    DeliveryAgentModel.findOneAndUpdate = () => {
      return {
        exec: async () => ({
          _id: agentId,
          name: 'Oldest Idle Agent',
          cityId,
          currentAssignmentId: deliveryId,
        }),
      } as any;
    };

    // Mock DeliveryAssignmentModel.findOneAndUpdate (Atomic Update Success)
    DeliveryAssignmentModel.findOneAndUpdate = () => {
      return {
        exec: async () => ({
          ...delivery,
          deliveryAgentId: agentId,
          deliveryStatus: 'assigned',
        }),
      } as any;
    };

    const result = await runDispatchEngineForOrder(deliveryId);
    assert.ok(result);
    assert.equal(result.deliveryStatus, 'assigned');
    assert.equal(result.deliveryAgentId?.toString(), agentId.toString());
  } finally {
    repo.findDeliveryAssignmentById = originalFindById;
    DeliveryAgentModel.find = originalAgentFind;
    DeliveryAgentModel.findOneAndUpdate = originalAgentFindOneAndUpdate;
    DeliveryAssignmentModel.findOneAndUpdate = originalAssignmentFindOneAndUpdate;
    notifications.publishDeliveryNotificationPlaceholders = originalPublish;
  }
});

test('runDispatchEngineForOrder stays pending when no agents are found', async () => {
  const originalFindById = repositoryModule.findDeliveryAssignmentById;
  const originalAgentFind = DeliveryAgentModel.find;

  const repo = repositoryModule as unknown as {
    findDeliveryAssignmentById: typeof repositoryModule.findDeliveryAssignmentById;
  };

  try {
    const delivery = makeDeliveryDoc();
    repo.findDeliveryAssignmentById = async () => delivery;

    // Return empty agents list
    DeliveryAgentModel.find = () => {
      return {
        sort: () => {
          return {
            limit: () => {
              return {
                exec: async () => [],
              };
            },
          };
        },
      } as any;
    };

    const result = await runDispatchEngineForOrder(deliveryId);
    assert.ok(result);
    assert.equal(result.deliveryStatus, 'pending_assignment');
    assert.equal(result.deliveryAgentId, null);
  } finally {
    repo.findDeliveryAssignmentById = originalFindById;
    DeliveryAgentModel.find = originalAgentFind;
  }
});

test('runDispatchEngineForAgent assigns oldest pending delivery in agent city', async () => {
  const originalAgentFindOne = DeliveryAgentModel.findOne;
  const originalAssignmentFind = DeliveryAssignmentModel.find;
  const originalAgentFindOneAndUpdate = DeliveryAgentModel.findOneAndUpdate;
  const originalAssignmentFindOneAndUpdate = DeliveryAssignmentModel.findOneAndUpdate;
  const originalPublish = notificationModule.publishDeliveryNotificationPlaceholders;

  const notifications = notificationModule as unknown as {
    publishDeliveryNotificationPlaceholders: typeof notificationModule.publishDeliveryNotificationPlaceholders;
  };

  try {
    notifications.publishDeliveryNotificationPlaceholders = async () => {};

    // Mock online agent profile
    DeliveryAgentModel.findOne = () => {
      return {
        exec: async () => ({
          _id: agentId,
          availabilityStatus: 'online',
          cityId,
          isActive: true,
          isVerified: true,
        }),
      } as any;
    };

    // Return oldest pending deliveries
    DeliveryAssignmentModel.find = () => {
      return {
        sort: () => {
          return {
            limit: () => {
              return {
                exec: async () => [makeDeliveryDoc()],
              };
            },
          };
        },
      } as any;
    };

    // Lock agent
    DeliveryAgentModel.findOneAndUpdate = () => {
      return {
        exec: async () => ({
          _id: agentId,
          currentAssignmentId: deliveryId,
        }),
      } as any;
    };

    // Update assignment (atomic double-allocation locks)
    DeliveryAssignmentModel.findOneAndUpdate = () => {
      return {
        exec: async () => makeDeliveryDoc({
          deliveryAgentId: agentId,
          deliveryStatus: 'assigned',
        }),
      } as any;
    };

    const result = await runDispatchEngineForAgent(agentId);
    assert.ok(result);
    assert.equal(result.deliveryStatus, 'assigned');
    assert.equal(result.deliveryAgentId?.toString(), agentId.toString());
  } finally {
    DeliveryAgentModel.findOne = originalAgentFindOne;
    DeliveryAssignmentModel.find = originalAssignmentFind;
    DeliveryAgentModel.findOneAndUpdate = originalAgentFindOneAndUpdate;
    DeliveryAssignmentModel.findOneAndUpdate = originalAssignmentFindOneAndUpdate;
    notifications.publishDeliveryNotificationPlaceholders = originalPublish;
  }
});

// ---------------------------------------------------------------------------
// markArrivedAtStore tests
// ---------------------------------------------------------------------------

test('markArrivedAtStore transitions status to arrived_at_store successfully', async () => {
  const originalFindById = repositoryModule.findDeliveryAssignmentById;
  const originalUpdate = repositoryModule.updateDeliveryAssignmentStatus;

  const repo = repositoryModule as unknown as {
    findDeliveryAssignmentById: typeof repositoryModule.findDeliveryAssignmentById;
    updateDeliveryAssignmentStatus: typeof repositoryModule.updateDeliveryAssignmentStatus;
  };

  try {
    const delivery = makeDeliveryDoc({
      deliveryAgentId: agentId,
      deliveryStatus: 'en_route_to_store',
    });
    repo.findDeliveryAssignmentById = async () => delivery;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    repo.updateDeliveryAssignmentStatus = async (_id, status, _fields, _event) => ({
      ...delivery,
      deliveryStatus: status,
      arrivedAtStoreAt: new Date(),
    } as any);

    const result = await markArrivedAtStore(deliveryId, agentId);
    assert.equal(result.deliveryStatus, 'arrived_at_store');
  } finally {
    repo.findDeliveryAssignmentById = originalFindById;
    repo.updateDeliveryAssignmentStatus = originalUpdate;
  }
});

test('markArrivedAtStore throws 403 when agent is not the assigned agent', async () => {
  const originalFindById = repositoryModule.findDeliveryAssignmentById;
  const repo = repositoryModule as unknown as {
    findDeliveryAssignmentById: typeof repositoryModule.findDeliveryAssignmentById;
  };

  try {
    const otherAgentId = new Types.ObjectId();
    const delivery = makeDeliveryDoc({
      deliveryAgentId: otherAgentId,
      deliveryStatus: 'en_route_to_store',
    });
    repo.findDeliveryAssignmentById = async () => delivery;

    await assert.rejects(
      markArrivedAtStore(deliveryId, agentId),
      (err: any) => {
        assert.equal(err.errorCode, 'DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER');
        assert.equal(err.statusCode, 403);
        return true;
      }
    );
  } finally {
    repo.findDeliveryAssignmentById = originalFindById;
  }
});

test('markArrivedAtStore throws 409 when delivery is in a terminal state', async () => {
  const originalFindById = repositoryModule.findDeliveryAssignmentById;
  const repo = repositoryModule as unknown as {
    findDeliveryAssignmentById: typeof repositoryModule.findDeliveryAssignmentById;
  };

  try {
    const delivery = makeDeliveryDoc({
      deliveryAgentId: agentId,
      deliveryStatus: 'delivered',
    });
    repo.findDeliveryAssignmentById = async () => delivery;

    await assert.rejects(
      markArrivedAtStore(deliveryId, agentId),
      (err: any) => {
        assert.equal(err.errorCode, 'DELIVERY_ALREADY_COMPLETED');
        assert.equal(err.statusCode, 409);
        return true;
      }
    );
  } finally {
    repo.findDeliveryAssignmentById = originalFindById;
  }
});

test('markArrivedAtStore throws 409 when preceding state is invalid', async () => {
  const originalFindById = repositoryModule.findDeliveryAssignmentById;
  const repo = repositoryModule as unknown as {
    findDeliveryAssignmentById: typeof repositoryModule.findDeliveryAssignmentById;
  };

  try {
    const delivery = makeDeliveryDoc({
      deliveryAgentId: agentId,
      deliveryStatus: 'assigned', // should be en_route_to_store
    });
    repo.findDeliveryAssignmentById = async () => delivery;

    await assert.rejects(
      markArrivedAtStore(deliveryId, agentId),
      (err: any) => {
        assert.equal(err.errorCode, 'DELIVERY_INVALID_STATE_TRANSITION');
        assert.equal(err.statusCode, 409);
        return true;
      }
    );
  } finally {
    repo.findDeliveryAssignmentById = originalFindById;
  }
});

// ---------------------------------------------------------------------------
// markPickedUp tests
// ---------------------------------------------------------------------------

test('markPickedUp transitions status to picked_up successfully', async () => {
  const originalFindById = repositoryModule.findDeliveryAssignmentById;
  const originalUpdate = repositoryModule.updateDeliveryAssignmentStatus;

  const repo = repositoryModule as unknown as {
    findDeliveryAssignmentById: typeof repositoryModule.findDeliveryAssignmentById;
    updateDeliveryAssignmentStatus: typeof repositoryModule.updateDeliveryAssignmentStatus;
  };

  try {
    const delivery = makeDeliveryDoc({
      deliveryAgentId: agentId,
      deliveryStatus: 'arrived_at_store',
    });
    repo.findDeliveryAssignmentById = async () => delivery;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    repo.updateDeliveryAssignmentStatus = async (_id, status, _fields, _event) => ({
      ...delivery,
      deliveryStatus: status,
      pickedUpAt: new Date(),
    } as any);

    const result = await markPickedUp(deliveryId, agentId, { verificationMethod: 'manual' });
    assert.equal(result.deliveryStatus, 'picked_up');
  } finally {
    repo.findDeliveryAssignmentById = originalFindById;
    repo.updateDeliveryAssignmentStatus = originalUpdate;
  }
});

test('markPickedUp throws 403 when agent is not the assigned agent', async () => {
  const originalFindById = repositoryModule.findDeliveryAssignmentById;
  const repo = repositoryModule as unknown as {
    findDeliveryAssignmentById: typeof repositoryModule.findDeliveryAssignmentById;
  };

  try {
    const otherAgentId = new Types.ObjectId();
    const delivery = makeDeliveryDoc({
      deliveryAgentId: otherAgentId,
      deliveryStatus: 'arrived_at_store',
    });
    repo.findDeliveryAssignmentById = async () => delivery;

    await assert.rejects(
      markPickedUp(deliveryId, agentId),
      (err: any) => {
        assert.equal(err.errorCode, 'DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER');
        assert.equal(err.statusCode, 403);
        return true;
      }
    );
  } finally {
    repo.findDeliveryAssignmentById = originalFindById;
  }
});

test('markPickedUp throws 409 when delivery is in a terminal state', async () => {
  const originalFindById = repositoryModule.findDeliveryAssignmentById;
  const repo = repositoryModule as unknown as {
    findDeliveryAssignmentById: typeof repositoryModule.findDeliveryAssignmentById;
  };

  try {
    const delivery = makeDeliveryDoc({
      deliveryAgentId: agentId,
      deliveryStatus: 'failed',
    });
    repo.findDeliveryAssignmentById = async () => delivery;

    await assert.rejects(
      markPickedUp(deliveryId, agentId),
      (err: any) => {
        assert.equal(err.errorCode, 'DELIVERY_ALREADY_COMPLETED');
        assert.equal(err.statusCode, 409);
        return true;
      }
    );
  } finally {
    repo.findDeliveryAssignmentById = originalFindById;
  }
});

test('markPickedUp throws 409 when preceding state is invalid', async () => {
  const originalFindById = repositoryModule.findDeliveryAssignmentById;
  const repo = repositoryModule as unknown as {
    findDeliveryAssignmentById: typeof repositoryModule.findDeliveryAssignmentById;
  };

  try {
    const delivery = makeDeliveryDoc({
      deliveryAgentId: agentId,
      deliveryStatus: 'en_route_to_store', // should be arrived_at_store
    });
    repo.findDeliveryAssignmentById = async () => delivery;

    await assert.rejects(
      markPickedUp(deliveryId, agentId),
      (err: any) => {
        assert.equal(err.errorCode, 'DELIVERY_INVALID_STATE_TRANSITION');
        assert.equal(err.statusCode, 409);
        return true;
      }
    );
  } finally {
    repo.findDeliveryAssignmentById = originalFindById;
  }
});

