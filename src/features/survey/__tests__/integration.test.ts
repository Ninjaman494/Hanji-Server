import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import casual from 'casual';
import { surveySubmissionsCollection } from 'datasources/databaseWrapper';
import { BugReport, General, Survey } from 'features';
import { executeOperation, setupMockDB, teardownDB } from 'tests/utils';
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

describe('survey feature', () => {
  beforeAll(async () => await setupMockDB());

  afterAll(async () => await teardownDB());

  it('handles createSurveySubmission mutations', async () => {
    const query = gql`
      mutation CreateSurveySubmission($submission: [Question]!) {
        createSurveySubmission(submission: $submission) {
          success
          message
        }
      }
    `;

    const { errors, data } = await executeOperation(server, query, {
      submission,
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
