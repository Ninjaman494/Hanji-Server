var conjugator = require('./korean/conjugator');
var stemmer = require('./korean/stemmer');
var dic = require('./dictionary');
var cmd=require('node-cmd');
let database = require('./database');
const express = require('express');
const app = express();

const server_port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const server_ip_address = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const FILE_ROUTE = "";
const CONJUGATE_ROUTE = '/conjugate=';

app.get('/', function(req, res){
    database.searchKor('하다',function(results){
        res.send(results)
    });
});

// Works for both conjugated and infinitive forms
app.get(CONJUGATE_ROUTE+':term', function (req, res) {
    let term = req.params.term;
    let regular = true;
    for (irregular_name in conjugator.verb_types) {
        let func = conjugator.verb_types[irregular_name];
        if (func(conjugator.base(term))) {
            regular = false;
            break;
        }
    }

    conjugator.conjugate(term,regular, function (conjugations) {
        res.json(conjugations);
    })
});

app.get('/searchKor=:term', function(req, res) {
    var stemList = stemmer.stem(req.params.term);
    if(stemList.length == 0){
        res.redirect(CONJUGATE_ROUTE+req.params.term);
    }if(stemList.length == 1){
        let stem = stemList[0].key;
        if(stem == undefined || stem.substr(stem.length-2,stem.length) == '드다'){
            stem = req.params.term;
        }
        res.redirect(CONJUGATE_ROUTE+stem);
    }else {
        var defCount = 0;
        stemList.forEach(function(item, index, array) {
            database.searchKor(item.key,function(value){
                stemList[index].def = value;
                defCount++;
                if(defCount == array.length){
                    res.json(stemList);
                }
            })
        });
    }
});

app.get('/stem=:term', function(req, res) {
    res.send(stemmer.stem(req.params.term));
});

app.get('/defineKor=:term', function(req, res){
    database.searchKor(req.params.term , function(value){
        res.send(value)
    });
});

app.get('/defineEng=:term', function(req, res){
   database.searchEng(req.params.term,function(value){
       res.send(value);
   })
});

app.listen(server_port,server_ip_address, function() {
    console.log('Listening on:'+server_ip_address+':'+server_port);
});

// Start Google Cloud proxy
//const string = FILE_ROUTE +"./cloud_sql_proxy -instances=hanji-191819:us-central1:hanji-1=tcp:5432 -credential_file="+FILE_ROUTE+"Hanji-d0f99eaccaf4.json";
//console.log("cmd string: "+string);
//cmd.run(string);

// Old code, used before custom Docker image was made
/*cmd.get("wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy",function(value){
   console.log("wget response: "+value);
   cmd.get("chmod +x cloud_sql_proxy",function(value){
       console.log("chmod response: "+value);
       cmd.run(string);
    });
});
cmd.get("chmod +x cloud_sql_proxy",function(value){
    console.log("chmod response: "+value);

});*/

// Implment String.format. First, check if it isn't implemented already.
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

String.prototype.regexIndexOf = function(regex, startpos) {
    let indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};