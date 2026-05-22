import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import * as repositoryModule from '../repositories/delivery-agent.repository';
import {
  getOwnProfile,
  updateOwnProfile,
  getAgentById,
  listAgents,
  setAgentAvailability,
} from './delivery-agent.service';
import type { IDeliveryAgentDocument } from '../types/delivery-agent.types';

// ---------------------------------------------------------------------------
// Test fixture helpers
// ---------------------------------------------------------------------------

const makeAgentDoc = (overrides: Partial<IDeliveryAgentDocument> = {}): IDeliveryAgentDocument => ({
  _id: { toString: () => 'agent001' } as unknown as Types.ObjectId,
  userId: { toString: () => 'user001' } as unknown as Types.ObjectId,
  name: 'Test Agent',
  phone: '+911234567890',
  email: 'agent@test.com',
  profilePhotoUrl: null,
  vehicleType: 'bike',
  vehicleNumber: 'MH01AB1234',
  availabilityStatus: 'offline',
  isVerified: false,
  isActive: true,
  isDeleted: false,
  deletedAt: null,
  cityId: null,
  currentAssignmentId: null,
  totalDeliveries: 0,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
} as unknown as IDeliveryAgentDocument);

// ---------------------------------------------------------------------------
// getOwnProfile tests
// ---------------------------------------------------------------------------

test('getOwnProfile returns mapped profile when agent exists', async () => {
  const doc = makeAgentDoc();
  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
  };
  const original = repo.findDeliveryAgentById;

  try {
    repo.findDeliveryAgentById = async () => doc;

    const result = await getOwnProfile('agent001');

    assert.equal(result.agentId, 'agent001');
    assert.equal(result.name, 'Test Agent');
    assert.equal(result.availabilityStatus, 'offline');
    assert.equal(result.totalDeliveries, 0);
  } finally {
    repo.findDeliveryAgentById = original;
  }
});

test('getOwnProfile throws DELIVERY_AGENT_NOT_FOUND when agent does not exist', async () => {
  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
  };
  const original = repo.findDeliveryAgentById;

  try {
    repo.findDeliveryAgentById = async () => null;

    await assert.rejects(
      () => getOwnProfile('nonexistent'),
      (err: AppError) => {
        assert.equal(err instanceof AppError, true);
        assert.equal(err.errorCode, ERROR_CODES.DELIVERY_AGENT_NOT_FOUND);
        assert.equal(err.statusCode, 404);
        return true;
      },
    );
  } finally {
    repo.findDeliveryAgentById = original;
  }
});

// ---------------------------------------------------------------------------
// updateOwnProfile tests
// ---------------------------------------------------------------------------

test('updateOwnProfile returns updated profile on valid data', async () => {
  const doc = makeAgentDoc({ name: 'Updated Agent' });
  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
    updateDeliveryAgentProfile: typeof repositoryModule.updateDeliveryAgentProfile;
  };
  const originalFind = repo.findDeliveryAgentById;
  const originalUpdate = repo.updateDeliveryAgentProfile;

  try {
    repo.findDeliveryAgentById = async () => makeAgentDoc();
    repo.updateDeliveryAgentProfile = async () => doc;

    const result = await updateOwnProfile('agent001', { name: 'Updated Agent' });

    assert.equal(result.name, 'Updated Agent');
  } finally {
    repo.findDeliveryAgentById = originalFind;
    repo.updateDeliveryAgentProfile = originalUpdate;
  }
});

test('updateOwnProfile throws DELIVERY_AGENT_NOT_FOUND when agent does not exist', async () => {
  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
  };
  const original = repo.findDeliveryAgentById;

  try {
    repo.findDeliveryAgentById = async () => null;

    await assert.rejects(
      () => updateOwnProfile('nonexistent', { name: 'Test' }),
      (err: AppError) => {
        assert.equal(err instanceof AppError, true);
        assert.equal(err.errorCode, ERROR_CODES.DELIVERY_AGENT_NOT_FOUND);
        assert.equal(err.statusCode, 404);
        return true;
      },
    );
  } finally {
    repo.findDeliveryAgentById = original;
  }
});

// ---------------------------------------------------------------------------
// getAgentById tests (admin)
// ---------------------------------------------------------------------------

test('getAgentById returns admin response when agent exists', async () => {
  const doc = makeAgentDoc({ isVerified: true, isActive: true });
  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
  };
  const original = repo.findDeliveryAgentById;

  try {
    repo.findDeliveryAgentById = async () => doc;

    const result = await getAgentById('agent001');

    assert.equal(result.agentId, 'agent001');
    assert.equal(result.isVerified, true);
    assert.equal(result.isActive, true);
  } finally {
    repo.findDeliveryAgentById = original;
  }
});

test('getAgentById throws DELIVERY_AGENT_NOT_FOUND when agent does not exist', async () => {
  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
  };
  const original = repo.findDeliveryAgentById;

  try {
    repo.findDeliveryAgentById = async () => null;

    await assert.rejects(
      () => getAgentById('nonexistent'),
      (err: AppError) => {
        assert.equal(err instanceof AppError, true);
        assert.equal(err.errorCode, ERROR_CODES.DELIVERY_AGENT_NOT_FOUND);
        assert.equal(err.statusCode, 404);
        return true;
      },
    );
  } finally {
    repo.findDeliveryAgentById = original;
  }
});

// ---------------------------------------------------------------------------
// listAgents tests (admin)
// ---------------------------------------------------------------------------

test('listAgents returns paginated result on valid filters', async () => {
  const doc = makeAgentDoc();
  const repo = repositoryModule as unknown as {
    findAllDeliveryAgents: typeof repositoryModule.findAllDeliveryAgents;
  };
  const original = repo.findAllDeliveryAgents;

  try {
    repo.findAllDeliveryAgents = async () => ({ agents: [doc, doc], total: 2 });

    const result = await listAgents({ page: 1, limit: 20 });

    assert.equal(result.agents.length, 2);
    assert.equal(result.total, 2);
    assert.equal(result.page, 1);
    assert.equal(result.limit, 20);
  } finally {
    repo.findAllDeliveryAgents = original;
  }
});

test('listAgents passes page and limit through correctly', async () => {
  const repo = repositoryModule as unknown as {
    findAllDeliveryAgents: typeof repositoryModule.findAllDeliveryAgents;
  };
  const original = repo.findAllDeliveryAgents;
  let capturedFilters: Parameters<typeof repositoryModule.findAllDeliveryAgents>[0] | undefined;

  try {
    repo.findAllDeliveryAgents = async (filters) => {
      capturedFilters = filters;

      return { agents: [], total: 0 };
    };

    const result = await listAgents({ page: 3, limit: 50 });

    assert.equal(result.page, 3);
    assert.equal(result.limit, 50);
    assert.equal(capturedFilters?.page, 3);
    assert.equal(capturedFilters?.limit, 50);
  } finally {
    repo.findAllDeliveryAgents = original;
  }
});

// ---------------------------------------------------------------------------
// mapToProfileResponse — verify isDeleted not exposed
// ---------------------------------------------------------------------------

test('getOwnProfile response excludes isDeleted and deletedAt', async () => {
  const doc = makeAgentDoc({ isDeleted: true, deletedAt: new Date() });
  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
  };
  const original = repo.findDeliveryAgentById;

  try {
    // Even if the doc somehow has isDeleted=true (hypothetically), response must not include it
    repo.findDeliveryAgentById = async () => doc;

    const result = await getOwnProfile('agent001') as unknown as Record<string, unknown>;

    assert.equal('isDeleted' in result, false);
    assert.equal('deletedAt' in result, false);
  } finally {
    repo.findDeliveryAgentById = original;
  }
});

// ---------------------------------------------------------------------------
// setAgentAvailability tests
// ---------------------------------------------------------------------------

test('setAgentAvailability toggles to offline without completeness checks', async () => {
  const agentDoc = makeAgentDoc({ availabilityStatus: 'online' });
  const updatedDoc = makeAgentDoc({ availabilityStatus: 'offline' });
  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
    updateDeliveryAgentAvailability: typeof repositoryModule.updateDeliveryAgentAvailability;
  };
  const originalFind = repo.findDeliveryAgentById;
  const originalUpdate = repo.updateDeliveryAgentAvailability;

  try {
    repo.findDeliveryAgentById = async () => agentDoc;
    repo.updateDeliveryAgentAvailability = async () => updatedDoc;

    const result = await setAgentAvailability('agent001', 'offline');

    assert.equal(result.availabilityStatus, 'offline');
  } finally {
    repo.findDeliveryAgentById = originalFind;
    repo.updateDeliveryAgentAvailability = originalUpdate;
  }
});

test('setAgentAvailability toggles to online when all completeness checks pass', async () => {
  const agentDoc = makeAgentDoc({
    cityId: { toString: () => 'city123' } as unknown as Types.ObjectId,
    vehicleNumber: 'MH01AB1234',
    isVerified: true,
    isActive: true,
    availabilityStatus: 'offline',
  });
  const updatedDoc = makeAgentDoc({
    cityId: { toString: () => 'city123' } as unknown as Types.ObjectId,
    vehicleNumber: 'MH01AB1234',
    isVerified: true,
    isActive: true,
    availabilityStatus: 'online',
  });

  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
    updateDeliveryAgentAvailability: typeof repositoryModule.updateDeliveryAgentAvailability;
  };
  const originalFind = repo.findDeliveryAgentById;
  const originalUpdate = repo.updateDeliveryAgentAvailability;

  try {
    repo.findDeliveryAgentById = async () => agentDoc;
    repo.updateDeliveryAgentAvailability = async () => updatedDoc;

    const result = await setAgentAvailability('agent001', 'online');

    assert.equal(result.availabilityStatus, 'online');
    assert.equal(result.cityId, 'city123');
  } finally {
    repo.findDeliveryAgentById = originalFind;
    repo.updateDeliveryAgentAvailability = originalUpdate;
  }
});

test('setAgentAvailability throws 409 when trying to go online with missing cityId', async () => {
  const agentDoc = makeAgentDoc({
    cityId: null, // missing city
    vehicleNumber: 'MH01AB1234',
    isVerified: true,
    isActive: true,
    availabilityStatus: 'offline',
  });

  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
  };
  const originalFind = repo.findDeliveryAgentById;

  try {
    repo.findDeliveryAgentById = async () => agentDoc;

    await assert.rejects(
      () => setAgentAvailability('agent001', 'online'),
      (err: AppError) => {
        assert.equal(err instanceof AppError, true);
        assert.equal(err.errorCode, ERROR_CODES.DELIVERY_AGENT_PROFILE_INCOMPLETE);
        assert.equal(err.statusCode, 409);
        return true;
      },
    );
  } finally {
    repo.findDeliveryAgentById = originalFind;
  }
});

test('setAgentAvailability throws 409 when trying to go online with missing or empty vehicleNumber', async () => {
  const agentDoc = makeAgentDoc({
    cityId: { toString: () => 'city123' } as unknown as Types.ObjectId,
    vehicleNumber: '', // empty vehicleNumber
    isVerified: true,
    isActive: true,
    availabilityStatus: 'offline',
  });

  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
  };
  const originalFind = repo.findDeliveryAgentById;

  try {
    repo.findDeliveryAgentById = async () => agentDoc;

    await assert.rejects(
      () => setAgentAvailability('agent001', 'online'),
      (err: AppError) => {
        assert.equal(err instanceof AppError, true);
        assert.equal(err.errorCode, ERROR_CODES.DELIVERY_AGENT_PROFILE_INCOMPLETE);
        assert.equal(err.statusCode, 409);
        return true;
      },
    );
  } finally {
    repo.findDeliveryAgentById = originalFind;
  }
});

test('setAgentAvailability throws 409 when trying to go online and isVerified is false', async () => {
  const agentDoc = makeAgentDoc({
    cityId: { toString: () => 'city123' } as unknown as Types.ObjectId,
    vehicleNumber: 'MH01AB1234',
    isVerified: false, // unverified
    isActive: true,
    availabilityStatus: 'offline',
  });

  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
  };
  const originalFind = repo.findDeliveryAgentById;

  try {
    repo.findDeliveryAgentById = async () => agentDoc;

    await assert.rejects(
      () => setAgentAvailability('agent001', 'online'),
      (err: AppError) => {
        assert.equal(err instanceof AppError, true);
        assert.equal(err.errorCode, ERROR_CODES.DELIVERY_AGENT_PROFILE_INCOMPLETE);
        assert.equal(err.statusCode, 409);
        return true;
      },
    );
  } finally {
    repo.findDeliveryAgentById = originalFind;
  }
});

test('setAgentAvailability throws 409 when trying to go online and isActive is false', async () => {
  const agentDoc = makeAgentDoc({
    cityId: { toString: () => 'city123' } as unknown as Types.ObjectId,
    vehicleNumber: 'MH01AB1234',
    isVerified: true,
    isActive: false, // inactive
    availabilityStatus: 'offline',
  });

  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
  };
  const originalFind = repo.findDeliveryAgentById;

  try {
    repo.findDeliveryAgentById = async () => agentDoc;

    await assert.rejects(
      () => setAgentAvailability('agent001', 'online'),
      (err: AppError) => {
        assert.equal(err instanceof AppError, true);
        assert.equal(err.errorCode, ERROR_CODES.DELIVERY_AGENT_PROFILE_INCOMPLETE);
        assert.equal(err.statusCode, 409);
        return true;
      },
    );
  } finally {
    repo.findDeliveryAgentById = originalFind;
  }
});

test('setAgentAvailability throws 404 when agent is not found', async () => {
  const repo = repositoryModule as unknown as {
    findDeliveryAgentById: typeof repositoryModule.findDeliveryAgentById;
  };
  const originalFind = repo.findDeliveryAgentById;

  try {
    repo.findDeliveryAgentById = async () => null;

    await assert.rejects(
      () => setAgentAvailability('nonexistent', 'online'),
      (err: AppError) => {
        assert.equal(err instanceof AppError, true);
        assert.equal(err.errorCode, ERROR_CODES.DELIVERY_AGENT_NOT_FOUND);
        assert.equal(err.statusCode, 404);
        return true;
      },
    );
  } finally {
    repo.findDeliveryAgentById = originalFind;
  }
});
