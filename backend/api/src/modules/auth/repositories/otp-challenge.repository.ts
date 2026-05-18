import { Types } from 'mongoose';
import { OtpChallengeModel } from '../models/otp-challenge.model';
import type { AuthRole } from '../types/auth-role.types';
import type { CreateOtpChallengeInput, OtpPurpose } from '../types/otp.types';

export const createOtpChallenge = (input: CreateOtpChallengeInput) => {
  return OtpChallengeModel.create(input);
};

export const findLatestActiveOtpChallenge = ({
  phone,
  role,
  purpose,
}: {
  phone: string;
  role: AuthRole;
  purpose: OtpPurpose;
}) => {
  return OtpChallengeModel.findOne({
    phone,
    role,
    purpose,
    isDeleted: false,
    verifiedAt: null,
  }).sort({ createdAt: -1 });
};

export const findOtpChallengeById = (challengeId: string) => {
  if (!Types.ObjectId.isValid(challengeId)) {
    return Promise.resolve(null);
  }

  return OtpChallengeModel.findOne({
    _id: new Types.ObjectId(challengeId),
    isDeleted: false,
  });
};

export const incrementOtpAttemptCount = (challengeId: string) => {
  if (!Types.ObjectId.isValid(challengeId)) {
    return Promise.resolve(null);
  }

  return OtpChallengeModel.findByIdAndUpdate(
    new Types.ObjectId(challengeId),
    {
      $inc: {
        attemptCount: 1,
      },
    },
    {
      new: true,
    },
  );
};

export const markOtpChallengeVerified = (challengeId: string) => {
  if (!Types.ObjectId.isValid(challengeId)) {
    return Promise.resolve(null);
  }

  return OtpChallengeModel.findByIdAndUpdate(
    new Types.ObjectId(challengeId),
    {
      verifiedAt: new Date(),
    },
    {
      new: true,
    },
  );
};

export const blockOtpChallenge = (challengeId: string, blockedUntil: Date) => {
  if (!Types.ObjectId.isValid(challengeId)) {
    return Promise.resolve(null);
  }

  return OtpChallengeModel.findByIdAndUpdate(
    new Types.ObjectId(challengeId),
    {
      blockedUntil,
    },
    {
      new: true,
    },
  );
};

export const updateOtpChallengeAfterResend = ({
  challengeId,
  otpHash,
  expiresAt,
  lastSentAt,
}: {
  challengeId: string;
  otpHash: string;
  expiresAt: Date;
  lastSentAt: Date;
}) => {
  if (!Types.ObjectId.isValid(challengeId)) {
    return Promise.resolve(null);
  }

  return OtpChallengeModel.findByIdAndUpdate(
    new Types.ObjectId(challengeId),
    {
      otpHash,
      expiresAt,
      lastSentAt,
      $inc: {
        resendCount: 1,
      },
    },
    {
      new: true,
    },
  );
};
