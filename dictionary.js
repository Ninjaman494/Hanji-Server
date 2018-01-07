var request = require('request');
var JSONStream = require('JSONStream')
var Xray = require('x-ray');
var x = Xray();

const NAVER_ENDIC_URL = "http://endic.naver.com/search.nhn?sLn=kr&searchOption=all&query=";
const GLOSBE_URL = "https://glosbe.com/gapi/translate?from={0}&dest={1}&format=json&phrase={2}";

this.searchNaver = function (term, callback) {
    const url = NAVER_ENDIC_URL + encodeURIComponent(term);
    console.log(url);
    x(url,".fnt_k05")(function(err,value){
        value = value.replace(/ *\([^)]*\) */, "");
        console.log(value.trim());
        callback(value.trim())
    });
};

this.searchGlosbeEng = function(term,verbOnly, callback) {
    const url = GLOSBE_URL.format('eng', 'kor', term);
    console.log(url);
    let stream = request({url: url}).pipe(JSONStream.parse('tuc.*.phrase.text'));
    let termsList = [];
    let dataSent = false;
    stream.on('data', function(data) {
        console.log('received:', data);
        if(verbOnly){
            if(data.charAt(data.length-1) == '다' && data.regexIndexOf(/[\u1100-\u11ff]|[!"'?.\/]/g) == -1){
                if(termsList.length < 5) {
                    termsList.push(data);
                }if(termsList.length == 5 && !dataSent){
                    dataSent = true;
                    callback(termsList);
                }
            }
        }else{
            termsList.push(data);
        }
    });
    stream.on('end', function(){
        if(!dataSent) {
            if (termsList.length == 0) {
                console.log('sent: Not found');
                callback('Not found');
            }else{
                callback(termsList);
            }
        }else if(!verbOnly){
            callback(termsList);
        }
    });

    stream.on('error', function () {
        callback('Error occurred');
    })
};

this.searchGlosbeKor = function(term, callback) {
    const url = GLOSBE_URL.format('kor', 'eng', encodeURIComponent(term));
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