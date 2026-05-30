import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as socketServerService from '../services/socket-server.service';
import {
  emitToRoom,
  joinCustomerRoom,
  joinDeliveryRoom,
  joinVendorRoom,
  leaveRoom,
} from '../services/socket-room.service';
import type { AuthenticatedSocket } from '../types/realtime.types';

type MutableSocketServerService = {
  getSocketServer: typeof socketServerService.getSocketServer;
};

const mutableSocketServerService = socketServerService as unknown as MutableSocketServerService;
const originalGetSocketServer = mutableSocketServerService.getSocketServer;

const buildSocket = () => {
  const joinedRooms: string[] = [];
  const leftRooms: string[] = [];

  return {
    socket: {
      join: async (roomName: string) => {
        joinedRooms.push(roomName);
      },
      leave: async (roomName: string) => {
        leftRooms.push(roomName);
      },
    } as unknown as AuthenticatedSocket,
    joinedRooms,
    leftRooms,
  };
};

test.afterEach(() => {
  mutableSocketServerService.getSocketServer = originalGetSocketServer;
});

test('room service joins scoped rooms', async () => {
  const { socket, joinedRooms } = buildSocket();

  await joinCustomerRoom(socket, 'customer-1');
  await joinDeliveryRoom(socket, 'agent-1');
  await joinVendorRoom(socket, 'store-1');

  assert.deepEqual(joinedRooms, [
    'customer:customer-1',
    'delivery:agent-1',
    'vendor:store-1',
  ]);
});

test('room service leaves a room', async () => {
  const { socket, leftRooms } = buildSocket();

  await leaveRoom(socket, 'order:order-1');

  assert.deepEqual(leftRooms, ['order:order-1']);
});

test('emitToRoom sends payload through namespace room', () => {
  const emitted: Array<{ roomName: string; eventName: string; payload: unknown }> = [];

  mutableSocketServerService.getSocketServer = () =>
    ({
      of: () => ({
        to: (roomName: string) => ({
          emit: (eventName: string, payload: unknown) => {
            emitted.push({ roomName, eventName, payload });
          },
        }),
      }),
    }) as never;

  emitToRoom(
    'order:order-1',
    'customer.delivery_progress_updated',
    {
      eventName: 'customer.delivery_progress_updated',
      roomName: 'order:order-1',
      emittedAt: new Date().toISOString(),
      data: {},
    },
    '/customer',
  );

  assert.equal(emitted.length, 1);
  assert.equal(emitted[0]?.roomName, 'order:order-1');
});
