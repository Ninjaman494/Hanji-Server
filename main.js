var conjugator = require('./korean/conjugator');
var stemmer = require('./korean/stemmer');
var dic = require('./dictionary');
const express = require('express');
const app = express();

app.get('/', function(req, res){
    dic.search('go',function(value){
        if(value == ""){
            res.send("Not found")
        }else {
            res.send(value);
        }
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

app.get('/definition=:term', function(req, res){
    dic.search(req.params.term,function(value){
        if(value == ""){
            res.send("Not found")
        }else {
            res.send(value);
        }
    });
});

app.listen(3000, function() {
    console.log('Listening on port 3000!')
});

