import { ObjectId } from 'mongodb';
import { Conjugation as RawConjugation } from 'korean/conjugator';
import { Conjugation, Entry, SpeechLevel, Tense } from 'generated/graphql';
import { EntryDoc, Id } from 'datasources/types';

/** Check if id is ObjectId and convert if it is, otherwise typecast string */
export const getSafeID = (id: Id): ObjectId =>
  ObjectId.isValid(id) ? new ObjectId(id) : (id as ObjectId);

export const entryReducer = ({ _id, ...rest }: EntryDoc): Entry => ({
  id: _id.toString(),
  alwaysHonorific: false, // default to false
  ...rest,
});

export const conjugationReducer = ({
  conjugation_name,
  conjugated,
  infinitive, // eslint-disable-line @typescript-eslint/no-unused-vars -- Not exposed in API
  romanized,
  tense,
  speechLevel,
  ...rest
}: RawConjugation): Conjugation => ({
  name: conjugation_name,
  conjugation: conjugated,
  romanization: romanized,
  tense: tense as Tense,
  speechLevel: speechLevel as SpeechLevel,
  ...rest,
});
