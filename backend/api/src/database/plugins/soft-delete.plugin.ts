import type { Query, Schema } from 'mongoose';

type SoftDeleteQuery = Query<unknown, unknown>;

const addNotDeletedFilter = function (this: SoftDeleteQuery): void {
  this.where({ isDeleted: { $ne: true } });
};

export const softDeletePlugin = (schema: Schema): void => {
  schema.statics.softDeleteById = function (id: string) {
    return this.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        status: 'deleted',
      },
      {
        new: true,
      },
    );
  };

  schema.pre('find', addNotDeletedFilter);
  schema.pre('findOne', addNotDeletedFilter);
  schema.pre('findOneAndUpdate', addNotDeletedFilter);
  schema.pre('countDocuments', addNotDeletedFilter);
};
