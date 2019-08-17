const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});
const db = admin.firestore();
const posCountMap = {};
let hasExampleCount = 0;
let totalExamples = 0;

async function fetchAndCount() {
    let snapshot = await db.collection('words').get();
    for(let doc of snapshot.docs) {
        console.log(doc.id, '=>', doc.data());
        posCountMap[doc.data().pos] = (posCountMap[doc.data().pos] || 0) + 1;

        // Count examples
        let exampleSnapShot = await doc.ref.collection('examples').get();
        let size = exampleSnapShot.size;
        if(size > 0) {
            console.log(doc.id, '->', exampleSnapShot.docs[0].data().sentence);
            hasExampleCount += 1;
            totalExamples += size;
        }
    }
    console.log('Total Entries:', snapshot.size);
    console.log('Count by POS:', posCountMap);
    console.log('Entries with Examples:',hasExampleCount);
    console.log('Total Examples:', totalExamples);
    return snapshot;
}

fetchAndCount()
    .then((snapshot) => {
        db.collection('stats')
            .doc('global')
            .set({
                total_entries: snapshot.size,
                count_by_POS: posCountMap,
                entries_with_examples: hasExampleCount,
                total_examples: totalExamples,
            })
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });