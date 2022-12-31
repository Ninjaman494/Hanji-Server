import * as databaseWrapper from 'datasources/databaseWrapper';
import * as messaging from 'firebase-admin/messaging';
import { ObjectId } from 'mongodb';
import refreshWOD from '../refreshWOD';

const entry = {
  _id: new ObjectId(),
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

const updateOne = jest.fn();
const toArray = jest.fn().mockReturnValue([entry]);
const send = jest.fn();

jest.spyOn(databaseWrapper, 'globalCollection').mockReturnValue({
  updateOne,
} as any);
jest.spyOn(databaseWrapper, 'wordsCollection').mockReturnValue({
  aggregate: () => ({ toArray }),
} as any);
jest.spyOn(messaging, 'getMessaging').mockReturnValue({ send } as any);

describe('refreshWOD function', () => {
  it('creates a new Word of the Day', async () => {
    await refreshWOD();

    expect(toArray).toHaveBeenCalled();
    expect(updateOne).toHaveBeenCalledWith(
      { _id: 'wod' },
      {
        $set: {
          entryID: entry._id,
          updated: expect.any(Date),
        },
      },
      { upsert: true },
    );
  });

  it('sends a push notification', async () => {
    await refreshWOD();

    expect(send).toHaveBeenCalledWith({
      topic: 'all',
      notification: {
        title: `Today's word is ${entry.term}`,
        body: `Do you know what ${entry.term} means?`,
      },
      android: {
        notification: { channelId: 'wod' },
      },
      data: {
        type: 'wod',
        entryId: entry._id.toString(),
      },
    });
  });
});
