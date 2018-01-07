var conjugator = require('./korean/conjugator');
var stemmer = require('./korean/stemmer');
var dic = require('./dictionary');
const express = require('express');
const app = express();

const server_port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const server_ip_address = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const CONJUGATE_ROUTE = '/conjugate=';

app.get('/', function(req, res){
    dic.searchGlosbeKor('듣다',function(translation){
        res.send(translation);
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
            dic.searchGlosbeKor(item.key,function(value){
               stemList[index].def = value;
               defCount++;
               if(defCount == array.length){
                   res.json(stemList);
               }
            });
        });
    }
});

app.get('/stem=:term', function(req, res) {
    res.send(stemmer.stem(req.params.term));
});

app.get('/defineKor=:term', function(req, res){
    dic.searchGlosbeKor(req.params.term,function(value){
        res.send(value);
    });
});

app.get('/defineEng=:term', function(req, res){
    dic.searchGlosbeEng(req.params.term,true,function(value){
        res.send(value);
    });
});

app.listen(server_port,server_ip_address, function() {
    console.log('Listening on:'+server_ip_address+':'+server_port);
});

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