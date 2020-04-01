const { MongoClient} = require('mongodb');
const uri = "***REMOVED***";

const posCountMap = {};
let hasExampleCount = 0;
let totalExamples = 0;
let totalEntries = 0;

async function fetchAndCount() {
    const mongo = new MongoClient(uri, { useNewUrlParser: true});
    await mongo.connect();
    let words = mongo.db("hanji").collection("words");
    await words.find().forEach(doc => {
        console.log(doc._id);
        posCountMap[doc.pos] = (posCountMap[doc.pos] || 0) + 1;
        totalEntries += 1;

        // Count examples
        if(doc.examples  != null) {
            hasExampleCount += 1;
            totalExamples += doc.examples.length;
        }
    });

    console.log('Total Entries:', totalEntries);
    console.log('Count by POS:', posCountMap);
    console.log('Entries with Examples:',hasExampleCount);
    console.log('Total Examples:', totalExamples);

    await mongo.db("hanji").collection("stats")
        .updateOne({ _id: "global" },{
            $set: {
                count_by_POS: posCountMap,
                entries_with_examples: hasExampleCount,
                total_entries: totalEntries,
                total_examples: totalExamples
            }
        });
    await mongo.close();
}

fetchAndCount()
    .catch((err) => {
        console.log('Error getting documents', err);
    });