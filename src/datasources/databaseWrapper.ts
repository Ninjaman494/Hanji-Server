import { MongoClient } from 'mongodb';
import { EntryDoc, EntrySuggestionDoc, SurveySubmissionDoc } from './database';

const DB_NAME = 'hanji';

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

export const entrySuggestionsCollection = async () => {
  if (!mongo) throw new Error('Database not connected');
  return mongo.db(DB_NAME).collection<EntrySuggestionDoc>('words-suggestions');
};

export const surveySubmissionsCollection = async () => {
  if (!mongo) throw new Error('Database not connected');
  return mongo
    .db(DB_NAME)
    .collection<SurveySubmissionDoc>('survey-submissions');
};
