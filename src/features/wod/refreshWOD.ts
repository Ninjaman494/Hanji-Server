import { globalCollection, wordsCollection } from 'datasources/databaseWrapper';
import { EntryDoc } from 'datasources/types';

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
};

export default refreshWOD;
