import { ObjectId } from 'mongodb';
import { is_hangeul } from 'korean/hangeul';
import { Id } from 'datasources/database';

/** Check if id is ObjectID or old form */
export const getSafeID = (id: Id): ObjectId => {
  const hasHangul = Array.from(id as string).some((char) => is_hangeul(char));
  return !hasHangul ? new ObjectId(id) : (id as ObjectId);
};
