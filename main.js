var conjugator = require('./korean/conjugator');
var stemmer = require('./korean/stemmer');
const express = require('express');
const app = express();

app.get('/', function(req, res){
    conjugator.conjugate("가다",true,function(conjugations){
        res.json(conjugations[0]);
    });
});

app.get('/search=:term', function (req, res) {
    var term = req.params.term; // Works for both infinitives and conjugated
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
    res.redirect('/search='+infin);
});

app.listen(3000, function() {
    console.log('Listening on port 3000!')
});

