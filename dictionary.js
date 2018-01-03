var request = require('request');
var JSONStream = require('JSONStream')
var Xray = require('x-ray');
var x = Xray();

const NAVER_ENDIC_URL = "http://endic.naver.com/search.nhn?sLn=kr&searchOption=all&query=";
const GLOSBE_URL = "https://glosbe.com/gapi/translate?from={0}&dest={1}&format=json&phrase={2}";

this.searchNaver = function (term, callback) {
    var url = NAVER_ENDIC_URL+encodeURIComponent(term);
    console.log(url);
    x(url,".fnt_k05")(function(err,value){
        value = value.replace(/ *\([^)]*\) */, "");
        console.log(value.trim());
        callback(value.trim())
    });
};

this.searchGlosbeEng = function(term, callback) {
    var url = GLOSBE_URL.format('eng','kor',term);
    console.log(url);
    var stream = request({url: url}).pipe(JSONStream.parse('tuc.0.phrase.text'));
    var dataReceived = false;
    stream.on('data', function(data) {
        dataReceived = true;
        console.log('received:', data);
        callback(data);
    });
    stream.on('end', function(){
        if(!dataReceived) {
            console.log('Not found');
            callback('Not found');
        }
    });
};

this.searchGlosbeKor = function(term, callback) {
    var url = GLOSBE_URL.format('kor','eng',encodeURIComponent(term));
    console.log(url);
    var stream = request({url: url}).pipe(JSONStream.parse('tuc.*.phrase.text'));

    var dataReceived = 0;
    var string = '';
    stream.on('data', function(data) {
        if(dataReceived == 0){
            string = data;
        }else{
            string += ", "+data;
        }
        dataReceived++;

        console.log('received:', data);
        if(dataReceived == 2) {
            dataReceived++;
            console.log('sent:'+string);
            callback(string);
        }
    });
    stream.on('end', function(){
        if(dataReceived == 0) {
            console.log('Not found');
            callback('Not found');
        }else if(dataReceived == 1){
            callback(string);
        }
    });
};