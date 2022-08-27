require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URL;

const printResults = (map) =>
  console.log(
    `Saved Words: ${map['Saved Words']}, Explanations: ${map.Explanations}, Stories: ${map.Stories}, Flashcards: ${map.Flashcards}`,
  );

const surveyResults = async () => {
  const mongo = new MongoClient(uri, { useNewUrlParser: true });
  await mongo.connect();

  const mongoCollection = await mongo
    .db('hanji')
    .collection('survey-submissions')
    .find()
    .toArray();

  const skillMap = {};
  const firstMap = {};
  const secondMap = {};
  mongoCollection.forEach(({ skillLevel, firstFeature, secondFeature }) => {
    if (!skillMap[skillLevel]) skillMap[skillLevel] = 0;
    skillMap[skillLevel] += 1;

    if (!firstMap[firstFeature]) firstMap[firstFeature] = 0;
    firstMap[firstFeature] += 1;

    if (!secondMap[secondFeature]) secondMap[secondFeature] = 0;
    secondMap[secondFeature] += 1;
  });

  const combinedMap = Object.fromEntries(
    Object.entries(firstMap).map(([key, val]) => [key, val + secondMap[key]]),
  );

  console.log(skillMap);
  printResults(firstMap);
  printResults(secondMap);
  printResults(combinedMap);
};

surveyResults().then(() => process.exit(0));
