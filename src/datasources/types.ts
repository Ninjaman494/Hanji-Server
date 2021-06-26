import { ObjectId } from 'mongodb';

export type Result = {
  cursor?: number;
  results: Entry[];
};

export type Entry = {
  id: string;
  term: string;
  pos: string;
  definitions: string[];
  examples?: Example[];
  antonyms?: string[];
  synonyms?: string[];
  regular?: boolean;
  note?: string;
};

export type Example = {
  sentence: string;
  translation: string;
};

export type Conjugation = {
  name: string;
  conjugation: string;
  type: string;
  tense: Tense;
  speechLevel: SpeechLevel;
  honorific: boolean;
  pronunciation: string;
  romanization: string;
  reasons: string[];
};

export type EntrySuggestion = {
  id: string;
  entryID: string;
  applied: boolean;
  examples?: Example[];
  antonyms?: string[];
  synonyms?: string[];
};

export type EntrySuggestionResponse = {
  success: boolean;
  message: string;
  entry?: Entry;
  suggestion?: EntrySuggestion;
};

export type EntrySuggestionInput = {
  entryID: ObjectId | string;
  antonyms?: string[];
  synonyms?: string[];
  examples?: Example[];
};

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
