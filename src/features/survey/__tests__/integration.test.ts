import { ApolloServer, gql } from 'apollo-server';
import casual from 'casual';
import {
  connectDB,
  surveySubmissionsCollection,
} from 'datasources/databaseWrapper';
import { BugReport, General, Survey } from 'features';
import { MongoClient } from 'mongodb';
import resolvers from '../resolvers';

const submission = [
  { question: casual.sentence, response: casual.sentence },
  { question: casual.sentence, response: casual.sentence },
  { question: casual.sentence, response: casual.sentence },
];

const server = new ApolloServer({
  typeDefs: [General, BugReport, Survey],
  resolvers,
});

let mongoClient: MongoClient;

describe('survey feature', () => {
  beforeAll(async () => {
    process.env.MONGO_URL = (global as any).__MONGO_URI__;
    mongoClient = await connectDB();
  });

  afterAll(async () => await mongoClient.close());

  it('handles createSurveySubmission mutations', async () => {
    const query = gql`
      mutation CreateSurveySubmission($submission: [Question]!) {
        createSurveySubmission(submission: $submission) {
          success
          message
        }
      }
    `;

    const { errors, data } = await server.executeOperation({
      query,
      variables: { submission },
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.createSurveySubmission).toEqual({
      success: true,
      message: 'Submission successfully created',
    });

    // Verify submission was created
    const docs = await surveySubmissionsCollection().find().toArray();
    expect(docs.length).toEqual(1);
    expect(docs[0]).toEqual({
      _id: expect.anything(),
      ...submission.reduce(
        (prev, { question, response }) => ({ ...prev, [question]: response }),
        {},
      ),
    });
  });
});
