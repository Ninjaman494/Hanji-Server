var conjugator = require('./korean/conjugator');
var stemmer = require('./korean/stemmer');
var dic = require('./dictionary');
const express = require('express');
const app = express();

var server_port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.IP || process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.get('/', function(req, res){
    dic.searchGlosbeKor('듣다',function(translation){
        res.send(translation);
    });
});

// Works for both conjugated and infinitive forms
app.get('/search=:term', function (req, res) {
    var term = stemmer.stem(req.params.term);
    if(term == undefined || term.substr(term.length-2,term.length) == '드다'){ // Ending only appears for infinitive forms
            term = req.params.term;
    }

    var regular = true;
    for (irregular_name in conjugator.verb_types) {
        var func = conjugator.verb_types[irregular_name];
        if (func(conjugator.base(term))) {
            regular = false;
            break;
        }
    }

    conjugator.conjugate(term,regular, function (conjugations) {
        res.json(conjugations);
    })
});

app.get('/stem=:term', function(req, res) {
    var infin = stemmer.stem(req.params.term);
    res.send(infin);
});

app.get('/defineKor=:term', function(req, res){
    dic.searchGlosbeKor(req.params.term,function(value){
        res.send(value);
    });
});

app.get('/defineEng=:term', function(req, res){
    dic.searchGlosbeEng(req.params.term,function(value){
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