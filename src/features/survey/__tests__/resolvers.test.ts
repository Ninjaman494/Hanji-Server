import casual from 'casual';
import * as databaseWrapper from 'datasources/databaseWrapper';
import resolvers from '../resolvers';

const submission = [
  { question: casual.sentence, response: casual.sentence },
  { question: casual.sentence, response: casual.sentence },
  { question: casual.sentence, response: casual.sentence },
];

const mockDB = (success: boolean) => {
  jest.spyOn(databaseWrapper, 'surveySubmissionsCollection').mockReturnValue({
    insertOne: () => ({ insertedId: success ? 'foobar' : null }),
  } as any);
};

describe('survey resolver', () => {
  it('resolves createSurveySubmission mutation', async () => {
    mockDB(true);

    const { success, message } = await (
      resolvers.Mutation.createSurveySubmission as any
    )(null, { submission });

    expect(success).toBeTruthy();
    expect(message).toEqual('Submission successfully created');
  });

  it('handles errors', async () => {
    mockDB(false);

    const { success, message } = await (
      resolvers.Mutation.createSurveySubmission as any
    )(null, { submission });

    expect(success).toBeFalsy();
    expect(message).toEqual('Failed to add submission to database');
  });
});
