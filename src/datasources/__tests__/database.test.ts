import DatabaseAPI, {
  EntryDoc,
  EntrySuggestionDoc,
  SurveySubmissionDoc,
} from '../database';
import { Collection, MongoClient, ObjectId } from 'mongodb';
import casual from 'casual';

const verbId = new ObjectId();
const verbEntry = {
  term: '가다',
  pos: 'Verb',
  definitions: ['to go'],
  antonyms: ['오다'],
  examples: [
    {
      sentence: 'I go',
      translation: '저는 가요',
    },
  ],
};

const nounId = new ObjectId();
const nounEntry = {
  term: '사과',
  pos: 'Noun',
  definitions: ['apple'],
};

const suggestionId = new ObjectId();
const suggestionEntry = {
  entryID: verbId,
  antonyms: verbEntry.antonyms,
  examples: verbEntry.examples,
};

describe('DatabaseAPI Datasource', () => {
  let mongoClient: MongoClient;
  let datasource: DatabaseAPI;
  let wordsCollection: Collection<EntryDoc>;
  let suggestionsCollection: Collection<EntrySuggestionDoc>;
  let surveyCollection: Collection<SurveySubmissionDoc>;

  beforeAll(async () => {
    mongoClient = new MongoClient((global as any).__MONGO_URI__);
    datasource = new DatabaseAPI(mongoClient);
    await mongoClient.connect();

    wordsCollection = mongoClient.db('hanji').collection('words');
    suggestionsCollection = mongoClient
      .db('hanji')
      .collection('words-suggestions');
    surveyCollection = mongoClient.db('hanji').collection('survey-submissions');
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  describe('read operations', () => {
    beforeAll(async () => {
      await wordsCollection.deleteMany({});
      await suggestionsCollection.deleteMany({});
      await wordsCollection.createIndex({
        definitions: 'text',
      });

      await wordsCollection.insertMany([
        { _id: verbId, ...verbEntry },
        { _id: nounId, ...nounEntry },
      ]);
      await suggestionsCollection.insertOne({
        _id: suggestionId,
        ...suggestionEntry,
      });
    });

    test('fetchEntry', async () => {
      const doc = await datasource.fetchEntry(verbId);
      expectDocEquals(doc, verbId, verbEntry);
    });

    test('fetchEntries', async () => {
      const entries = await datasource.fetchEntries(nounEntry.term);

      expect(entries.length).toEqual(1);
      expectDocEquals(entries[0], nounId, nounEntry);
    });

    test('fetchExamples', async () => {
      const examples = await datasource.fetchExamples(verbId);
      expect(examples).toEqual(verbEntry.examples);
    });

    test('searchEnglish', async () => {
      const { results, cursor } = await datasource.searchEnglish('to go');

      expect(cursor).toEqual(1);
      expect(results.length).toEqual(1);
      expectDocEquals(results[0], verbId, { score: 1, ...verbEntry });
    });

    test('fetchWordoftheDay', async () => {
      const doc = await datasource.fetchWordoftheDay();

      doc.id === verbId.toString()
        ? expectDocEquals(doc, verbId, verbEntry)
        : expectDocEquals(doc, nounId, nounEntry);
    });

    test('fetchEntrySuggestion', async () => {
      const doc = await datasource.fetchEntrySuggestion(suggestionId);
      const { entryID, ...rest } = suggestionEntry;

      expectDocEquals(doc, suggestionId, {
        applied: false,
        entryID: entryID.toString(),
        ...rest,
      });
    });

    test('fetchEntrySuggestions', async () => {
      const suggestions = await datasource.fetchEntrySuggestions();

      const { entryID, ...rest } = suggestionEntry;
      expect(suggestions.length).toEqual(1);
      expectDocEquals(suggestions[0], suggestionId, {
        applied: false,
        entryID: entryID.toString(),
        ...rest,
      });
    });
  });

  describe('write operations', () => {
    beforeAll(async () => {
      await wordsCollection.deleteMany({});
      await suggestionsCollection.deleteMany({});
      await surveyCollection.deleteMany({});

      await wordsCollection.insertOne({
        _id: verbId,
        ...verbEntry,
      });
    });

    test('createEntrySuggestion', async () => {
      const { success, message } = await datasource.createEntrySuggestion(
        suggestionEntry,
      );

      const { _id, ...rest } =
        await suggestionsCollection.findOne<EntrySuggestionDoc>();

      expect(success).toBeTruthy();
      expect(message).toEqual('Entry suggestion successfully created');
      expect(rest).toEqual({ synonyms: null, ...suggestionEntry });
    });

    test('createSurveySubmission', async () => {
      const submission = [...Array(10)].map(() => ({
        question: casual.sentence,
        response: casual.word,
      }));

      const { success, message } = await datasource.createSurveySubmission(
        submission,
      );
      const { _id, ...rest } =
        await surveyCollection.findOne<SurveySubmissionDoc>();

      expect(success).toBeTruthy();
      expect(message).toEqual('Submission successfully created');
      expect(rest).toEqual({ submission });
    });
  });

  describe('edit operations', () => {
    beforeEach(async () => {
      await wordsCollection.deleteMany({});
      await suggestionsCollection.deleteMany({});

      await wordsCollection.insertOne({
        _id: verbId,
        ...verbEntry,
      });
      await suggestionsCollection.insertOne({
        _id: suggestionId,
        ...suggestionEntry,
      });
    });

    test('applyEntrySuggestion', async () => {
      const { success, message, entry, suggestion } =
        await datasource.applyEntrySuggestion(suggestionId);

      const updatedAntonyms = [
        ...verbEntry.antonyms,
        ...suggestionEntry.antonyms,
      ];
      const updatedExamples = [
        ...verbEntry.examples,
        ...suggestionEntry.examples,
      ];

      // Verify response
      expect(success).toBeTruthy();
      expect(message).toEqual('Entry suggestion successfully applied');
      expect(entry).toEqual({
        ...verbEntry,
        id: verbId.toString(),
        antonyms: updatedAntonyms,
        examples: updatedExamples,
      });
      expect(suggestion).toEqual({
        ...suggestionEntry,
        id: suggestionId.toString(),
        entryID: suggestionEntry.entryID.toString(),
        applied: true,
      });

      // Verify database updated
      const { applied } =
        await suggestionsCollection.findOne<EntrySuggestionDoc>({
          _id: suggestionId,
        });
      const { antonyms, examples } = await wordsCollection.findOne<EntryDoc>({
        _id: verbId,
      });

      expect(applied).toBeTruthy();
      expect(antonyms).toEqual(updatedAntonyms);
      expect(examples).toEqual(updatedExamples);
    });

    test('editEntrySuggestion', async () => {
      const updatedSynonyms = ['synonym'];

      const { success, message, suggestion } =
        await datasource.editEntrySuggestion(suggestionId, {
          entryID: verbId,
          synonyms: updatedSynonyms,
        });

      // Verify response
      expect(success).toBeTruthy();
      expect(message).toEqual('Successfully edited suggestion');
      expect(suggestion).toEqual({
        ...suggestionEntry,
        id: suggestionId.toString(),
        entryID: suggestionEntry.entryID.toString(),
        applied: false,
        synonyms: updatedSynonyms,
      });

      // Verify database updated
      const { synonyms } =
        await suggestionsCollection.findOne<EntrySuggestionDoc>({
          _id: suggestionId,
        });
      expect(synonyms).toEqual(updatedSynonyms);
    });
  });
});

const expectDocEquals = (
  { id, ...rest }: Record<string, any>,
  entryId: ObjectId,
  entry: any,
) => {
  expect(id).toEqual(entryId.toString());
  expect(rest).toEqual(entry);
};
