import { ObjectId } from 'mongodb';
import { is_hangeul } from 'korean/hangeul';
import { EntryDoc, Id } from 'datasources/database';
import { Entry } from 'generated/graphql';

/** Check if id is ObjectID or old form */
export const getSafeID = (id: Id): ObjectId => {
  const hasHangul = Array.from(id as string).some((char) => is_hangeul(char));
  return !hasHangul ? new ObjectId(id) : (id as ObjectId);
};

export const entryReducer = ({ _id, ...rest }: EntryDoc): Entry => ({
  id: _id.toString(),
  ...rest,
});
