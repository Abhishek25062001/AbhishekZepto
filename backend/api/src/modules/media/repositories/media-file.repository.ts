import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { MediaFileModel, type MediaFileRecord } from '../models/media-file.model';
import type { MediaListQuery } from '../types/media-file.types';

const notDeletedFilter = { isDeleted: false };

export const createMediaFile = async (
  payload: Partial<MediaFileRecord>,
): Promise<MediaFileRecord & { _id: Types.ObjectId }> => {
  const created = await MediaFileModel.create(payload);
  return created.toObject() as MediaFileRecord & { _id: Types.ObjectId };
};

export const findMediaFileById = async (
  mediaFileId: string,
  includeDeleted = false,
): Promise<(MediaFileRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(mediaFileId)) {
    return null;
  }

  const filter: FilterQuery<MediaFileRecord> = { _id: new Types.ObjectId(mediaFileId) };
  if (!includeDeleted) {
    Object.assign(filter, notDeletedFilter);
  }

  return MediaFileModel.findOne(filter).lean();
};

export const findMediaFileByStorageKey = async (
  storageKey: string,
): Promise<(MediaFileRecord & { _id: Types.ObjectId }) | null> =>
  MediaFileModel.findOne({ storageKey, ...notDeletedFilter }).lean();

export const updateMediaFileById = async (
  mediaFileId: string,
  payload: Partial<MediaFileRecord>,
): Promise<(MediaFileRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(mediaFileId)) {
    return null;
  }

  return MediaFileModel.findOneAndUpdate(
    { _id: new Types.ObjectId(mediaFileId), ...notDeletedFilter },
    { $set: payload },
    { new: true },
  ).lean();
};

export const softDeleteMediaFileById = async (
  mediaFileId: string,
  deletedBy: Types.ObjectId | null,
): Promise<(MediaFileRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(mediaFileId)) {
    return null;
  }

  return MediaFileModel.findOneAndUpdate(
    { _id: new Types.ObjectId(mediaFileId), ...notDeletedFilter },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy,
        status: 'deleted',
      },
    },
    { new: true },
  ).lean();
};

export const listMediaFiles = async (
  query: MediaListQuery,
): Promise<{
  items: (MediaFileRecord & { _id: Types.ObjectId })[];
  total: number;
}> => {
  const filter: FilterQuery<MediaFileRecord> = { ...notDeletedFilter };

  if (query.ownerType) {
    filter.ownerType = query.ownerType;
  }
  if (query.ownerId && Types.ObjectId.isValid(query.ownerId)) {
    filter.ownerId = new Types.ObjectId(query.ownerId);
  }
  if (query.uploadedBy && Types.ObjectId.isValid(query.uploadedBy)) {
    filter.uploadedBy = new Types.ObjectId(query.uploadedBy);
  }
  if (query.fileCategory) {
    filter.fileCategory = query.fileCategory;
  }
  if (query.filePurpose) {
    filter.filePurpose = query.filePurpose;
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.isPublic !== undefined) {
    filter.isPublic = query.isPublic;
  }
  if (query.search) {
    filter.originalFileName = { $regex: query.search, $options: 'i' };
  }

  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    MediaFileModel.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(query.limit).lean(),
    MediaFileModel.countDocuments(filter),
  ]);

  return { items, total };
};

export const countMediaFilesByOwner = async (
  ownerType: MediaFileRecord['ownerType'],
  ownerId: string,
): Promise<number> => {
  if (!ownerType || !Types.ObjectId.isValid(ownerId)) {
    return 0;
  }

  return MediaFileModel.countDocuments({
    ownerType,
    ownerId: new Types.ObjectId(ownerId),
    ...notDeletedFilter,
  });
};
