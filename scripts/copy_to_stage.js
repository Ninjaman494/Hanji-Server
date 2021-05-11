require('dotenv').config();
const { MongoClient} = require('mongodb');
const uri = process.env.MONGO_URL;

const copyToStage = async () => {
    const mongo = new MongoClient(uri, { useNewUrlParser: true });
    await mongo.connect();

    const mongoCollection = await mongo
        .db("hanji")
        .collection("words")
        .find()
        .limit(10)
        .toArray();

    const response = await mongo
        .db("hanji")
        .collection("words-staging")
        .insertMany(mongoCollection);

    if(response.insertedCount === 10) {
        console.log("SUCCESS");
    } else {
        console.error(`FAILURE: Only inserted ${response.insertedCount} documents`);
    }
};

copyToStage().then(() => process.exit(0));