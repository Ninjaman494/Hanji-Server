import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import { wordsCollection } from 'datasources/databaseWrapper';
import { Entry, General, WOD } from 'features';
import { map } from 'lodash';
import { ObjectId } from 'mongodb';
import {
  ENTRIES,
  executeOperation,
  setupMockDB,
  teardownDB,
} from 'tests/utils';
import resolvers from '../resolvers';

const server = new ApolloServer({
  typeDefs: [General, Entry, WOD],
  resolvers,
});

const mockDate = (date: Date) =>
  jest.spyOn(global, 'Date').mockImplementation(() => date as any);

describe('wod feature', () => {
  beforeAll(async () => await setupMockDB());

  afterAll(async () => await teardownDB());

  it('fetches the same wod within 24 hours', async () => {
    const spy = mockDate(new Date('2000-01-01T00:00:00'));

    const query = gql`
      query WOD {
        wordOfTheDay {
          id
          term
          pos
          definitions
          antonyms
          synonyms
          examples {
            sentence
            translation
          }
          regular
          note
        }
      }
    `;

    const { errors, data } = await executeOperation(server, query);

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(map(ENTRIES, ({ term }) => term)).toContain(data.wordOfTheDay.term);

    // Move forward 23 hours and refetch
    spy.mockRestore();
    mockDate(new Date('2000-01-01T23:00:00'));
    const { errors: newErrors, data: newData } = await executeOperation(
      server,
      query,
    );

    expect(newErrors).toBeUndefined();
    expect(newData).toBeDefined();
    expect(newData.wordOfTheDay).toEqual(data.wordOfTheDay);
  });

  it('fetches a different wod after 24 hours', async () => {
    const spy = mockDate(new Date('2000-01-01T00:00:00'));

    const query = gql`
      query WOD {
        wordOfTheDay {
          id
          term
          pos
          definitions
          antonyms
          synonyms
          examples {
            sentence
            translation
          }
          regular
          note
        }
      }
    `;

    const { errors, data } = await executeOperation(server, query);
    const wod = data.wordOfTheDay;

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(map(ENTRIES, ({ term }) => term)).toContain(wod.term);

    // Delete so it doesn't pick the same wod twice
    spy.mockRestore();
    await wordsCollection().deleteOne({ _id: new ObjectId(wod.id) });

    // Move forward 25 hours and refetch
    mockDate(new Date('2000-01-02T01:00:00'));
    const { errors: newErrors, data: newData } = await executeOperation(
      server,
      query,
    );
    const newWod = newData.wordOfTheDay;

    expect(newErrors).toBeUndefined();
    expect(newData).toBeDefined();
    expect(newWod).not.toEqual(wod);
    expect(map(ENTRIES, ({ term }) => term)).toContain(newWod.term);
  });
});
