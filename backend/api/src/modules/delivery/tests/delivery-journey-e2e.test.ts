/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Types } from 'mongoose';
import { DeliveryAgentModel } from '../models/delivery-agent.model';
import { DeliveryAssignmentModel } from '../models/delivery-assignment.model';
import * as repositoryModule from '../repositories/delivery-assignment.repository';
import * as orderRepositoryModule from '../../orders/repositories/order.repository';
import * as storeRepositoryModule from '../../stores/repositories/store.repository';
import * as notificationModule from '../services/delivery-notification.service';
import {
  initializeDeliveryForOrder,
  runDispatchEngineForOrder,
  markArrivedAtStore,
  markPickedUp,
  markEnRouteToCustomer,
  markArrivedAtCustomer,
  markDelivered,
} from '../services/delivery-assignment.service';

// Fixture constants
const orderId = new Types.ObjectId();
const customerId = new Types.ObjectId();
const storeId = new Types.ObjectId();
const cityId = new Types.ObjectId();
const deliveryId = new Types.ObjectId();
const agentId = new Types.ObjectId();

test('E2E Delivery Lifecycle Journey - complete active delivery flow', async () => {
  // Save originals to restore at the end
  const originalFindByOrder = repositoryModule.findDeliveryAssignmentByOrderId;
  const originalFindOrder = orderRepositoryModule.findOrderById;
  const originalFindStore = storeRepositoryModule.findStoreById;
  const originalCreate = repositoryModule.createDeliveryAssignment;
  const originalFindById = repositoryModule.findDeliveryAssignmentById;
  const originalAgentFind = DeliveryAgentModel.find;
  const originalAgentFindOneAndUpdate = DeliveryAgentModel.findOneAndUpdate;
  const originalAssignmentFindOneAndUpdate = DeliveryAssignmentModel.findOneAndUpdate;
  const originalUpdateStatus = repositoryModule.updateDeliveryAssignmentStatus;
  const originalTransitionOrder = orderRepositoryModule.transitionOrderById;
  const originalAgentUpdateOne = DeliveryAgentModel.updateOne;
  const originalPublish = notificationModule.publishDeliveryNotificationPlaceholders;

  const repo = repositoryModule as any;
  const orderRepo = orderRepositoryModule as any;
  const storeRepo = storeRepositoryModule as any;
  const notifications = notificationModule as any;

  // Stored state representing the in-memory "database"
  let deliveryDbDoc: any = null;
  let orderStatusInDb = 'placed';
  let agentCurrentAssignmentIdInDb: any = null;
  const capturedNotifications: Array<{ deliveryId: string; eventType: string }> = [];

  try {
    // 1. Setup in-memory stubs
    repo.findDeliveryAssignmentByOrderId = async (id: any) => {
      if (deliveryDbDoc && deliveryDbDoc.orderId.toString() === id.toString()) {
        return deliveryDbDoc;
      }
      return null;
    };

    orderRepo.findOrderById = async () => ({
      _id: orderId,
      orderNumber: 'ORD-E2E-999',
      customerId,
      storeId,
    } as any);

    storeRepo.findStoreById = async () => ({
      _id: storeId,
      cityId,
    } as any);

    repo.createDeliveryAssignment = async (payload: any) => {
      deliveryDbDoc = {
        ...payload,
        _id: deliveryId,
        deliveryAgentId: null,
        deliveryStatus: 'pending_assignment',
        assignedAt: null,
        arrivedAtStoreAt: null,
        pickedUpAt: null,
        enRouteToCustomerAt: null,
        arrivedAtCustomerAt: null,
        completedAt: null,
        deliveredAt: null,
        failedAt: null,
        cancelledAt: null,
        timeline: [
          {
            actorType: 'system',
            actorId: null,
            fromStatus: 'none',
            toStatus: 'pending_assignment',
            reason: 'Delivery assignment initialized',
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return deliveryDbDoc;
    };

    repo.findDeliveryAssignmentById = async (id: any) => {
      if (deliveryDbDoc && deliveryDbDoc._id.toString() === id.toString()) {
        return deliveryDbDoc;
      }
      return null;
    };

    notifications.publishDeliveryNotificationPlaceholders = async (delivery: any, eventType: string) => {
      capturedNotifications.push({ deliveryId: delivery._id.toString(), eventType });
    };

    // 2. Step 1: Initialize delivery assignment for order
    const initialized = await initializeDeliveryForOrder(orderId);
    assert.ok(initialized);
    assert.equal(initialized.deliveryStatus, 'pending_assignment');
    assert.equal(initialized.orderId.toString(), orderId.toString());
    assert.equal(initialized.cityId.toString(), cityId.toString());
    assert.equal(deliveryDbDoc.deliveryStatus, 'pending_assignment');

    // 3. Step 2: Auto-assignment matching engine
    DeliveryAgentModel.find = () => ({
      sort: () => ({
        limit: () => ({
          exec: async () => [{ _id: agentId, name: 'Rider E2E', cityId }],
        }),
      }),
    } as any);

    DeliveryAgentModel.findOneAndUpdate = () => ({
      exec: async () => {
        agentCurrentAssignmentIdInDb = deliveryId;
        return { _id: agentId, name: 'Rider E2E', cityId, currentAssignmentId: deliveryId };
      },
    } as any);

    DeliveryAssignmentModel.findOneAndUpdate = () => ({
      exec: async () => {
        deliveryDbDoc.deliveryAgentId = agentId;
        deliveryDbDoc.deliveryStatus = 'assigned';
        deliveryDbDoc.assignedAt = new Date();
        deliveryDbDoc.timeline.push({
          actorType: 'system',
          actorId: null,
          fromStatus: 'pending_assignment',
          toStatus: 'assigned',
          reason: 'Auto-assigned by matching engine',
          createdAt: new Date(),
        });
        return deliveryDbDoc;
      },
    } as any);

    const assigned = await runDispatchEngineForOrder(deliveryId);
    assert.ok(assigned);
    assert.equal(assigned.deliveryStatus, 'assigned');
    assert.equal((assigned as any).deliveryAgentId?.toString(), agentId.toString());
    assert.equal(agentCurrentAssignmentIdInDb?.toString(), deliveryId.toString());
    assert.equal(capturedNotifications.some(n => n.eventType === 'assigned'), true);

    // Helper for status transitions
    repo.updateDeliveryAssignmentStatus = async (id: any, status: any, updateFields: any, timelineEvent: any) => {
      if (deliveryDbDoc && deliveryDbDoc._id.toString() === id.toString()) {
        deliveryDbDoc = {
          ...deliveryDbDoc,
          deliveryStatus: status,
          ...updateFields,
        };
        if (timelineEvent) {
          deliveryDbDoc.timeline.push({
            ...timelineEvent,
            createdAt: new Date(),
          });
        }
        return deliveryDbDoc;
      }
      return null;
    };

    // 4. Step 3: Rider arrives at store
    // Set preceding state to en_route_to_store to satisfy sequence check
    deliveryDbDoc.deliveryStatus = 'en_route_to_store';
    const arrivedStore = await markArrivedAtStore(deliveryId, agentId);
    assert.equal(arrivedStore.deliveryStatus, 'arrived_at_store');
    assert.equal(capturedNotifications.some(n => n.eventType === 'arrived_at_store'), true);

    // 5. Step 4: Rider picks up package
    const pickedUp = await markPickedUp(deliveryId, agentId, { verificationMethod: 'barcode' });
    assert.equal(pickedUp.deliveryStatus, 'picked_up');
    assert.equal(capturedNotifications.some(n => n.eventType === 'picked_up'), true);

    // 6. Step 5: Rider starts transit to customer location
    const enRoute = await markEnRouteToCustomer(deliveryId, agentId);
    assert.equal(enRoute.deliveryStatus, 'en_route_to_customer');

    // 7. Step 6: Rider arrives at customer's building
    const arrivedCustomer = await markArrivedAtCustomer(deliveryId, agentId);
    assert.equal(arrivedCustomer.deliveryStatus, 'arrived_at_customer');
    assert.equal(capturedNotifications.some(n => n.eventType === 'arrived_at_customer'), true);

    // 8. Step 7: Completed package handover (delivered)
    orderRepo.transitionOrderById = async (id: any, payload: any) => {
      assert.equal(id, orderId.toString());
      orderStatusInDb = payload.orderStatus;
      return { _id: orderId, orderStatus: payload.orderStatus };
    };

    DeliveryAgentModel.updateOne = (async (filter: any, update: any) => {
      assert.equal(filter._id.toString(), agentId.toString());
      if (update.$set.currentAssignmentId === null) {
        agentCurrentAssignmentIdInDb = null;
      }
      return { acknowledged: true } as any;
    }) as any;

    const completed = await markDelivered(deliveryId, agentId, { verificationMethod: 'otp' });
    assert.equal(completed.deliveryStatus, 'delivered');
    assert.equal(orderStatusInDb, 'delivered');
    assert.equal(agentCurrentAssignmentIdInDb, null);
    assert.equal(capturedNotifications.some(n => n.eventType === 'delivered'), true);

    // Verify timeline length
    assert.ok(completed.timeline.length >= 7);
  } finally {
    // Restore all mocked functions
    repo.findDeliveryAssignmentByOrderId = originalFindByOrder;
    orderRepo.findOrderById = originalFindOrder;
    storeRepo.findStoreById = originalFindStore;
    repo.createDeliveryAssignment = originalCreate;
    repo.findDeliveryAssignmentById = originalFindById;
    DeliveryAgentModel.find = originalAgentFind;
    DeliveryAgentModel.findOneAndUpdate = originalAgentFindOneAndUpdate;
    DeliveryAssignmentModel.findOneAndUpdate = originalAssignmentFindOneAndUpdate;
    repo.updateDeliveryAssignmentStatus = originalUpdateStatus;
    orderRepo.transitionOrderById = originalTransitionOrder;
    DeliveryAgentModel.updateOne = originalAgentUpdateOne;
    notifications.publishDeliveryNotificationPlaceholders = originalPublish;
  }
});
