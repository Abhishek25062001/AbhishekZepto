import type { SchemaOptions } from 'mongoose';

export const baseSchemaOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (document, returnedObject) => {
      void document;

      return returnedObject;
    },
  },
};
