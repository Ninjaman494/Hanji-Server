import { connectDB } from '../datasources/databaseWrapper';
import NodeEnvironment from 'jest-environment-node';
import { MongoClient } from 'mongodb';
import { ENTRIES } from './utils';

export default class IntegrationEnvironment extends NodeEnvironment {
  mongoClient: MongoClient;

  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    this.mongoClient = await connectDB();

    const wordsCollection = this.mongoClient.db('hanji').collection('words');
    await wordsCollection.createIndex({ definitions: 'text' });
    await wordsCollection.insertMany(ENTRIES);

    this.global.mongoClient = this.mongoClient;
  }

  async teardown() {
    await this.mongoClient.close();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}
