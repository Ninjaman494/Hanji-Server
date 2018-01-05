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

this.searchGlosbeEng = function(term,verbOnly, callback) {
    var url = GLOSBE_URL.format('eng','kor',term);
    console.log(url);
    var stream = request({url: url}).pipe(JSONStream.parse('tuc.*.phrase.text'));
    var dataReceived = [];
    stream.on('data', function(data) {
        console.log('received:', data);
        if(verbOnly){
            if(data.charAt(data.length-1) == '다' && data.regexIndexOf(/[\u1100-\u11ff]|[!"'?.\/]/g) == -1){
                dataReceived.push(data);
            }
        }else{
            dataReceived.push(data);
        }
    });
    stream.on('end', function(){
        if(dataReceived.length == 0) {
            console.log('Not found');
            callback('Not found');
        }else{
            callback(dataReceived);
        }
    });
};

this.searchGlosbeKor = function(term, callback) {
    var url = GLOSBE_URL.format('kor','eng',encodeURIComponent(term));
    console.log(url);
    try{
        var stream = request({url: url}).pipe(JSONStream.parse('tuc.*.phrase.text'));
    }catch(e){
        console.log(e);
        callback("Error occurred");
    }

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
    stream.on('error', function(){
        callback('Error occurred');
    })
};