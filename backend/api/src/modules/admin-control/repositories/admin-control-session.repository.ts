import { Types } from 'mongoose';

import { AdminControlSessionModel } from '../models/admin-control-session.model';
import type {
  AdminControlSessionRecord,
  CreateAdminControlSessionInput,
} from '../types/admin-control-session.types';

export const createAdminControlSessionRecord = async (
  input: CreateAdminControlSessionInput,
): Promise<AdminControlSessionRecord & { _id: Types.ObjectId }> => {
  const now = new Date();
  const record = await AdminControlSessionModel.create({
    adminId: new Types.ObjectId(input.adminId),
    sessionType: input.sessionType,
    cityScope: input.cityScope.map((cityId) => new Types.ObjectId(cityId)),
    startedAt: now,
    endedAt: null,
    activeModules: input.activeModules,
    lastHeartbeatAt: now,
  });

  return record as AdminControlSessionRecord & { _id: Types.ObjectId };
};

export const findAdminControlSessionById = async (
  sessionId: string,
): Promise<(AdminControlSessionRecord & { _id: Types.ObjectId }) | null> => {
  return AdminControlSessionModel.findById(sessionId).exec() as Promise<
    (AdminControlSessionRecord & { _id: Types.ObjectId }) | null
  >;
};

export const updateAdminControlSessionHeartbeat = async (
  sessionId: string,
  heartbeatAt: Date,
): Promise<(AdminControlSessionRecord & { _id: Types.ObjectId }) | null> => {
  return AdminControlSessionModel.findByIdAndUpdate(
    sessionId,
    { $set: { lastHeartbeatAt: heartbeatAt } },
    { new: true },
  ).exec() as Promise<(AdminControlSessionRecord & { _id: Types.ObjectId }) | null>;
};

export const endAdminControlSessionRecord = async (
  sessionId: string,
  endedAt: Date,
): Promise<(AdminControlSessionRecord & { _id: Types.ObjectId }) | null> => {
  return AdminControlSessionModel.findByIdAndUpdate(
    sessionId,
    { $set: { endedAt, lastHeartbeatAt: endedAt } },
    { new: true },
  ).exec() as Promise<(AdminControlSessionRecord & { _id: Types.ObjectId }) | null>;
};

export const endExpiredAdminControlSessions = async (
  before: Date,
  endedAt: Date,
): Promise<number> => {
  const result = await AdminControlSessionModel.updateMany(
    {
      endedAt: null,
      lastHeartbeatAt: { $lt: before },
    },
    { $set: { endedAt } },
  ).exec();

  return result.modifiedCount;
};

export const findActiveAdminControlSessions = async (
  since: Date,
): Promise<Array<AdminControlSessionRecord & { _id: Types.ObjectId }>> => {
  return AdminControlSessionModel.find({
    endedAt: null,
    lastHeartbeatAt: { $gte: since },
  })
    .sort({ lastHeartbeatAt: -1 })
    .limit(100)
    .exec() as Promise<Array<AdminControlSessionRecord & { _id: Types.ObjectId }>>;
};
