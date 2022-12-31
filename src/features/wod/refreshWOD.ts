import { globalCollection, wordsCollection } from 'datasources/databaseWrapper';
import { EntryDoc } from 'datasources/types';
import { getMessaging, Message } from 'firebase-admin/messaging';

const refreshWOD = async () => {
  const result = await wordsCollection()
    .aggregate<EntryDoc>([{ $sample: { size: 1 } }])
    .toArray();
  const newWOD = result[0];

  await globalCollection().updateOne(
    { _id: 'wod' },
    {
      $set: {
        entryID: newWOD._id,
        updated: new Date(),
      },
    },
    { upsert: true },
  );

  try {
    const message: Message = {
      topic: 'all',
      notification: {
        title: `Today's word is ${newWOD.term}`,
        body: `Do you know what ${newWOD.term} means?`,
      },
      android: {
        notification: { channelId: 'wod' },
      },
      data: {
        type: 'wod',
        entryId: newWOD._id.toString(),
      },
    };
    const response = await getMessaging().send(message);
    console.log(`FCM successful: ${response}`);
  } catch (err) {
    console.error(`FCM failed: ${err}`);
  }
};

export default refreshWOD;
