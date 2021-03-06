import { DataSource } from 'apollo-datasource';
import { MongoClient, ObjectId, PushOperator } from 'mongodb';
import {
  Entry,
  EntrySuggestion,
  EntrySuggestionInput,
  EntrySuggestionResponse,
  Example,
  SearchResult,
} from './types';
import * as hangeul from '../korean/hangeul';
const URI = process.env.MONGO_URL;

const PAGE_COUNT = 20;

export type EntryDoc = Omit<Entry, 'id'> & {
  _id: Id;
};

export type EntrySuggestionDoc = Omit<
  EntrySuggestion,
  'id' | 'entryID' | 'applied'
> & {
  _id: ObjectId;
  entryID: Id;
  applied?: boolean;
};

export type Id = ObjectId | string; // scraped entries have string ids

class DatabaseAPI extends DataSource {
  lastFetched: Date;
  lastWOD: EntryDoc;

  constructor() {
    super();
    this.lastFetched = new Date();
    this.lastWOD = null;
  }

  async fetchEntries(term: string): Promise<Entry[]> {
    const mongo = new MongoClient(URI, { useNewUrlParser: true });
    await mongo.connect();
    const results = await mongo
      .db('hanji')
      .collection<EntryDoc>('words')
      .find({ term: term })
      .toArray();
    mongo.close();

    return results.map((doc) => DatabaseAPI.entryReducer(doc));
  }

  async fetchEntry(id: Id): Promise<Entry> {
    id = this.getSafeID(id);

    const mongo = new MongoClient(URI, { useNewUrlParser: true });
    await mongo.connect();
    const results = await mongo
      .db('hanji')
      .collection<EntryDoc>('words')
      .find({ _id: id })
      .toArray();
    mongo.close();

    return results.length > 0 ? DatabaseAPI.entryReducer(results[0]) : null;
  }

  async fetchExamples(id: Id): Promise<Example[]> {
    id = this.getSafeID(id);

    const mongo = new MongoClient(URI, { useNewUrlParser: true });
    await mongo.connect();
    const results = await mongo
      .db('hanji')
      .collection<EntryDoc>('words')
      .find({ _id: id }, { projection: { examples: 1 } })
      .toArray();
    mongo.close();

    return results[0]?.examples ?? [];
  }

  async searchEnglish(query: string, cursor?: number): Promise<SearchResult> {
    const mongo = new MongoClient(URI, { useNewUrlParser: true });
    await mongo.connect();
    if (!cursor) {
      cursor = 0;
    }

    const array = await mongo
      .db('hanji')
      .collection<EntryDoc>('words')
      .find({ $text: { $search: query } }, { limit: PAGE_COUNT, skip: cursor })
      .project({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .toArray();
    mongo.close();

    const entries = array.map((e) => DatabaseAPI.entryReducer(e));
    cursor = entries.length === 0 ? -1 : cursor + entries.length;

    return {
      cursor: cursor,
      results: entries,
    };
  }

  async fetchWordoftheDay(): Promise<Entry> {
    const mongo = new MongoClient(URI, { useNewUrlParser: true });
    await mongo.connect();
    const hourDiff =
      Math.abs(new Date().getTime() - this.lastFetched.getTime()) / 36e5;

    if (this.lastWOD == null || hourDiff >= 24) {
      // fetch new Word of the Day
      const result = await mongo
        .db('hanji')
        .collection<EntryDoc>('words')
        .aggregate([{ $sample: { size: 1 } }])
        .toArray();
      this.lastWOD = result[0];
      this.lastFetched = new Date();
    }

    mongo.close();

    return DatabaseAPI.entryReducer(this.lastWOD);
  }

  async createEntrySuggestion(
    suggestionData: EntrySuggestionInput,
  ): Promise<EntrySuggestionResponse> {
    const entry = await this.fetchEntry(suggestionData.entryID);
    if (!entry) {
      return {
        success: false,
        message: "An entry with the given id doesn't exist",
      };
    }

    const mongo = new MongoClient(URI, { useNewUrlParser: true });
    await mongo.connect();

    const { ops } = await mongo
      .db('hanji')
      .collection<EntrySuggestionDoc>('words-suggestions')
      .insertOne({
        entryID: this.getSafeID(suggestionData.entryID),
        antonyms: suggestionData.antonyms?.filter((a) => a.length > 0),
        synonyms: suggestionData.synonyms?.filter((s) => s.length > 0),
        examples: suggestionData.examples?.filter(
          (e) => e.sentence.length > 0 && e.translation.length > 0,
        ),
      });
    mongo.close();

    if (ops.length !== 1) {
      return {
        success: false,
        message: 'Failed to insert suggestion into database',
      };
    }

    return {
      success: true,
      message: 'Entry suggestion successfully created',
      suggestion: DatabaseAPI.entrySuggestionReducer(ops[0]),
    };
  }

  async applyEntrySuggestion(id: Id): Promise<EntrySuggestionResponse> {
    const mongo = new MongoClient(URI, { useNewUrlParser: true });
    await mongo.connect();

    // Fetch suggestion, check it's not already applied
    const suggestion = await mongo
      .db('hanji')
      .collection<EntrySuggestionDoc>('words-suggestions')
      .findOne({ _id: this.getSafeID(id) });

    if (suggestion.applied) {
      return {
        success: false,
        message: 'This suggestion has already been applied',
      };
    }

    // Update entry based on suggestion
    const updates: PushOperator<EntryDoc> = {};
    if (suggestion.antonyms) {
      (updates.antonyms as Record<string, unknown>) = {
        $each: suggestion.antonyms,
      };
    }
    if (suggestion.synonyms) {
      (updates.synonyms as Record<string, unknown>) = {
        $each: suggestion.synonyms,
      };
    }
    if (suggestion.examples) {
      (updates.examples as Record<string, unknown>) = {
        $each: suggestion.examples,
      };
    }

    const { value: updatedEntry } = await mongo
      .db('hanji')
      .collection<EntryDoc>('words')
      .findOneAndUpdate(
        { _id: this.getSafeID(suggestion.entryID) },
        { $push: updates },
        { returnOriginal: false },
      );

    if (!updatedEntry) {
      return {
        success: false,
        message: 'Failed to insert suggestion into database',
      };
    }

    // Mark suggestion as applied
    const { value: updatedSuggestion } = await mongo
      .db('hanji')
      .collection<EntrySuggestionDoc>('words-suggestions')
      .findOneAndUpdate(
        { _id: this.getSafeID(id) },
        { $set: { applied: true } },
        { returnOriginal: false },
      );

    mongo.close();
    return {
      success: true,
      message: 'Entry suggestion successfully applied',
      entry: DatabaseAPI.entryReducer(updatedEntry),
      suggestion: DatabaseAPI.entrySuggestionReducer(updatedSuggestion),
    };
  }

  async editEntrySuggestion(
    id: Id,
    suggestionData: EntrySuggestionInput,
  ): Promise<EntrySuggestionResponse> {
    const mongo = new MongoClient(URI, { useNewUrlParser: true });
    await mongo.connect();

    const { value: updatedSuggestion } = await mongo
      .db('hanji')
      .collection<EntrySuggestionDoc>('words-suggestions')
      .findOneAndUpdate(
        { _id: this.getSafeID(id) },
        { $set: suggestionData },
        { returnOriginal: false },
      );

    if (!updatedSuggestion) {
      return {
        success: false,
        message: 'Failed to edit suggestion',
      };
    }

    return {
      success: true,
      message: 'Successfully edited suggestion',
      suggestion: DatabaseAPI.entrySuggestionReducer(updatedSuggestion),
    };
  }

  async deleteEntrySuggestion(id: Id): Promise<EntrySuggestionResponse> {
    const mongo = new MongoClient(URI, { useNewUrlParser: true });
    await mongo.connect();

    const { value } = await mongo
      .db('hanji')
      .collection<EntrySuggestionDoc>('words-suggestions')
      .findOneAndDelete({ _id: this.getSafeID(id) });

    if (!value) {
      return {
        success: false,
        message: 'Failed to delete suggestion',
      };
    }

    return {
      success: true,
      message: 'Successfully deleted suggestion',
    };
  }

  async fetchEntrySuggestions(): Promise<EntrySuggestion[]> {
    const mongo = new MongoClient(URI, { useNewUrlParser: true });
    await mongo.connect();

    const array = await mongo
      .db('hanji')
      .collection<EntrySuggestionDoc>('words-suggestions')
      .find()
      .toArray();
    mongo.close();

    return array.map((a) => DatabaseAPI.entrySuggestionReducer(a));
  }

  async fetchEntrySuggestion(id: Id): Promise<EntrySuggestion> {
    const mongo = new MongoClient(URI, { useNewUrlParser: true });
    await mongo.connect();

    const array = await mongo
      .db('hanji')
      .collection<EntrySuggestionDoc>('words-suggestions')
      .find({ _id: this.getSafeID(id) })
      .toArray();
    mongo.close();

    return array.length > 0
      ? DatabaseAPI.entrySuggestionReducer(array[0])
      : null;
  }

  static entryReducer(entry: EntryDoc): Entry {
    const { _id, ...rest } = entry;
    return {
      id: _id.toString(),
      ...rest,
    };
  }

  static entrySuggestionReducer(
    entrySuggestion: EntrySuggestionDoc,
  ): EntrySuggestion {
    const { _id, entryID, applied, ...rest } = entrySuggestion;
    return {
      id: _id.toString(),
      entryID: entryID.toString(),
      applied: !!applied,
      ...rest,
    };
  }

  static containsHangul(string: string): boolean {
    for (let i = 0; i < string.length; i++) {
      if (hangeul.is_hangeul(string[i])) {
        return true;
      }
    }
    return false;
  }

  getSafeID(id: Id): ObjectId {
    // Check if id is ObjectID or old form
    return !DatabaseAPI.containsHangul(id as string)
      ? new ObjectId(id)
      : (id as ObjectId);
  }
}

export default DatabaseAPI;
