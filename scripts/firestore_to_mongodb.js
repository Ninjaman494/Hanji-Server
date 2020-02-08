// Firebase Firestore Client
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert('../hanji-bd63d-849ae0babd80.json')
});
const settings = {timestampsInSnapshots: true}; // To remove timestamp warning
const db = admin.firestore();
db.settings(settings);

// Mongo DB client
const MongoClient = require('mongodb').MongoClient;
const uri = "***REMOVED***";

const posCountMap = {};
let hasExampleCount = 0;
let totalExamples = 0;

async function addDocuments(){
    let snapshot = await db.collection('words').limit(5).get();
    for(let doc of snapshot.docs) {
        let examples = await doc.ref.collection('examples').get();
        console.log("doc: " + doc.id);
        console.log("examples: " + examples.size);
        await addDocument(doc, examples);
    }
}

async function addDocument(doc, examples) {
    const mongo = new MongoClient(uri, { useNewUrlParser: true });
    await mongo.connect();

    let mongoCollection = mongo.db("hanji").collection("words");
    let mongoDoc = entryReducer(doc, examples);
    await mongoCollection.insertOne(mongoDoc, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            let insertedDoc = result.ops[0];
            posCountMap[insertedDoc.pos] = (posCountMap[insertedDoc.pos] || 0) + 1;
            if(insertedDoc.examples) {
                hasExampleCount += 1;
                totalExamples += insertedDoc.examples.size;
            }
        }
    });
    await mongo.close();
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

addDocuments().then( () => {
    console.log("Done");
    console.log('Count by POS:', posCountMap);
    console.log("totalExamples: " + totalExamples);
    console.log("hasExample Count: " + hasExampleCount);
});
/*
const mongo = new MongoClient(uri, { useNewUrlParser: true });
mongo.connect(async err => {
    let mongoCollection = mongo.db("hanji").collection("words");
    mongoCollection
        .find({ $text: { $search: "cAfE" } })
        .project({ score: { $meta: "textScore" } })
        .sort( { score: { $meta: "textScore" } } )
        .toArray().then(array => {
        console.log(array);
    })
});*/
