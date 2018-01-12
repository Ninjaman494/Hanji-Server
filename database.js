let pg = require("pg");
const conString = "postgresql://postgres:password@127.0.0.1:5432/kengdic";

const SEP = "; ";
const SEARCH_KOR = "SELECT def FROM korean_english WHERE word LIKE '%다' and word LIKE $1";
const SEARCH_ENG = "SELECT word FROM korean_english WHERE word LIKE '%다' and UPPER(def) LIKE UPPER($1)";

this.searchKor = function (term, callback) {
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
    });
};

this.searchEng = function (term,callback) {
    let client = new pg.Client(conString);
    client.connect();
    client.query(SEARCH_ENG,['%'+term],(err, res) => {
        let results = [];
        console.log(err ? err.stack : res.rows);
        res.rows.forEach(function(element){
            console.log(element.word);
            results.push(element.word);
        });
        callback(results);
        client.end()
    });
};