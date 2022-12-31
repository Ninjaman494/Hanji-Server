import { globalCollection, wordsCollection } from 'datasources/databaseWrapper';
import { EntryDoc } from 'datasources/types';
import { getMessaging } from 'firebase-admin/messaging';

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
    const message = {
      token:
        'd66KUA5aRdWb-ht4qNACmc:APA91bGI6HeNw1KcQ4qnkMYRhGhesEEjHHcB6LFvronBRomlV_tSknQIis0sb0oruVEpy2irPD57EbqoFuEsQXdDo4WAgZM-SBigT4yDoF651tzLZuX0Hudz9awwoeSCRKqix2yW1Vmz',
      data: {
        notifee: JSON.stringify({
          title: `Today's word is ${newWOD.term}`,
          body: `Do you know what ${newWOD.term} means?`,
          android: {
            channelId: 'wod',
            pressAction: {
              id: 'default',
            },
          },
        }),
      },
    };
    const response = await getMessaging().send(message);
    console.log(`FCM successful: ${response}`);
  } catch (err) {
    console.error(`FCM failed: ${err}`);
  }
};

export default refreshWOD;
