const admin = require('firebase-admin');
let serviceAccount = 'hanji-bd63d-849ae0babd80.json';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();


this.searchKor = function (term, callback) {
    db.collection('words').where('term','==',term).get()
        .then(snapshot => {
            callback(snapshot.docs[0].data());
        });
/*
    let client = new pg.Client(conString);
    client.connect();
    client.query(SEARCH_KOR,[term],(err, res) => {
        let results = "";
        console.log(err ? err.stack : res.rows);
        res.rows.forEach(function(element){
            console.log(element.def);
            if(results.indexOf(element.def) == -1) {
                results += SEP + element.def.toLowerCase();
            }
        });
        if(results == ""){
            results = "Not found";
        }else{
            results = results.replace(SEP, "");
        }
        callback(results);
        client.end()
    });*/
};

this.searchEng = function (term,callback) {
    /*let client = new pg.Client(conString);
    client.connect();
    let terms = ['% '+term, term, term+",%",'% '+term+",%"];
    client.query(SEARCH_ENG,terms,(err, res) => {
        let results = [];
        console.log(err ? err.stack : res.rows);
        res.rows.forEach(function(element){
            console.log(element.word);
            results.push(element.word);
        });
        callback(results);
        client.end()
    });*/
};