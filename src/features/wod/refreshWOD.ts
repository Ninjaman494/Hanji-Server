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
      token:
        'cjBxH-BsRoWdqbddjOJ9ke:APA91bF7P9V18sIAmEnBQa58VM9nDJmR-88aO-tU9VAF1X_Fg6UPJoIup87oI4CSTL8IQCrIqYYrzZgVQIAgBHlkW6-iDnfIaGqhLGbM4LLa99iQaoagIBNRXKkCiFyeIaxNp6QYYihs',
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
