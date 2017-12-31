var conjugator = require('./korean/conjugator');
const express = require('express');
const app = express();

app.get('/', function(req, res){
    conjugator.conjugate("가다",true,function(conjugations){
        res.json(conjugations[0]);
    });
});

app.get('/search=:term', function (req, res) {
    var regular = true;
    var term = req.params.term;
    for (irregular_name in conjugator.verb_types) {
        var func = conjugator.verb_types[irregular_name];
        if (func(conjugator.base(term))) {
            regular = false;
            break;
        }
    }

    conjugator.conjugate(term,regular, function (conjugations) {
        res.send(conjugations[1]);
    })
});

app.listen(3000, function() {
    console.log('Listening on port 3000!')
});

