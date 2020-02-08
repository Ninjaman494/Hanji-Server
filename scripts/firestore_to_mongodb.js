const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert('../hanji-bd63d-849ae0babd80.json')
});
const settings = {timestampsInSnapshots: true}; // To remove timestamp warning
const db = admin.firestore();
db.settings(settings);

const MongoClient = require('mongodb').MongoClient;
const uri = "***REMOVED***";

async function addDocument() {
    let firestoreCollection = await db.collection('words').get();
    await firestoreCollection.forEach(async doc => {
        let examples = await db
            .collection('words')
            .doc(doc.id)
            .collection('examples')
            .get();
        const mongo = new MongoClient(uri, { useNewUrlParser: true });
        await mongo.connect(async err => {
            if (err) {
                console.log(err);
                return;
            }

            let mongoCollection = mongo.db("hanji").collection("words");
            let mongoDoc = entryReducer(doc, examples);
            await mongoCollection.insertOne(mongoDoc, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(result)
                }
            });
            await mongo.close();
        });
    });
}

function entryReducer(entry, examples){
    let data = {
        _id: entry.id,
        term: entry.data().term,
        pos: entry.data().pos,
        definitions: entry.data().definitions
    };
    if(examples.docs.length > 0) {
        data.examples = exampleReducer(examples)
    }
    if(entry.data().antonyms != null) {
        data.antonyms = entry.data().antonyms;
    }
    if(entry.data().synonyms != null){
        data.synonyms = entry.data().synonyms;
    }
    if(entry.data().regular != null) {
        data.regular = entry.data().regular;
    }
    if(entry.data().note != null) {
        data.note = entry.data().note;
    }

    return data;
}

function exampleReducer(examples){
    let reducedExamples = [];
    examples.forEach(example => {
        reducedExamples.push({
            sentence: example.data().sentence,
            translation: example.data().translation
        })
    });
    return reducedExamples;
}

addDocument().then( () => console.log("Done"));
/*
const mongo = new MongoClient(uri, { useNewUrlParser: true });
mongo.connect(async err => {
    let mongoCollection = mongo.db("hanji").collection("words");
    mongoCollection
        .find({ $text: { $search: "cafe" } })
        .project({ score: { $meta: "textScore" } })
        .sort( { score: { $meta: "textScore" } } )
        .toArray().then(array => {
        console.log(array);
    })
});*/
