import { ObjectId } from 'mongodb';
import { is_hangeul } from 'korean/hangeul';
import { Conjugation as RawConjugation } from 'korean/conjugator';
import { Conjugation, Entry, SpeechLevel, Tense } from 'generated/graphql';
import { EntryDoc, Id } from 'datasources/types';

/** Check if id is ObjectId and convert if it is, otherwise typecast string */
export const getSafeID = (id: Id): ObjectId =>
  ObjectId.isValid(id) ? new ObjectId(id) : (id as ObjectId);

export const entryReducer = ({ _id, ...rest }: EntryDoc): Entry => ({
  id: _id.toString(),
  ...rest,
});

export const conjugationReducer = ({
  conjugation_name,
  conjugated,
  infinitive, // Not exposed in API
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
