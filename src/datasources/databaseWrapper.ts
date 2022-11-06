import { MongoClient } from 'mongodb';
import { EntryDoc, EntrySuggestionDoc, SurveySubmissionDoc } from './types';

const DB_NAME = (global as any).__MONGO_DB_NAME__ ?? 'hanji';
let mongo: MongoClient;

export const connectDB = async () => {
  if (!mongo) {
    mongo = new MongoClient(process.env.MONGO_URL);
    await mongo.connect();
  }
  return mongo;
};

export const wordsCollection = () => {
  if (!mongo) throw new Error('Database not connected');
  return mongo.db(DB_NAME).collection<EntryDoc>('words');
};

export const entrySuggestionsCollection = () => {
  if (!mongo) throw new Error('Database not connected');
  return mongo
    .db(DB_NAME)
    .collection<Omit<EntrySuggestionDoc, '_id'>>('words-suggestions');
};

export const surveySubmissionsCollection = () => {
  if (!mongo) throw new Error('Database not connected');
  return mongo
    .db(DB_NAME)
    .collection<Omit<SurveySubmissionDoc, '_id'>>('survey-submissions');
};
