import type { Schema } from 'mongoose';

type JsonRecord = {
  _id?: {
    toString: () => string;
  };
  id?: string;
  __v?: unknown;
};

export const toJSONPlugin = (schema: Schema): void => {
  schema.set('toJSON', {
    virtuals: true,
    transform: (document, returnedObject) => {
      void document;

      const jsonRecord = returnedObject as JsonRecord;

      if (jsonRecord._id) {
        jsonRecord.id = jsonRecord._id.toString();
        delete jsonRecord._id;
      }

      delete jsonRecord.__v;

      return jsonRecord;
    },
  });
};
