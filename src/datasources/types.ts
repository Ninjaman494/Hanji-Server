import { Entry, EntrySuggestion } from 'generated/graphql';
import { ObjectId } from 'mongodb';

export type Id = ObjectId | string; // scraped entries have string ids

export type EntrySuggestionDoc = Omit<
  EntrySuggestion,
  'id' | 'entryID' | 'applied'
> & {
  _id: ObjectId;
  entryID: Id;
  applied?: boolean;
};

export type EntryDoc = Omit<Entry, 'id'> & { _id: Id };

export type SurveySubmissionDoc = Record<string, string> & { _id: ObjectId };

export enum Tense {
  PRESENT = 'present',
  PAST = 'past',
  FUTURE = 'future',
  NONE = 'none',
}

export enum SpeechLevel {
  FORMAL_LOW = 'formal low',
  INFORMAL_LOW = 'informal low',
  INFORMAL_HIGH = 'informal high',
  FORMAL_HIGH = 'formal high',
  NONE = 'none',
}
