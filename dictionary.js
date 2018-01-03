var Xray = require('x-ray');
var x = Xray();

const NAVER_ENDIC_URL = "http://endic.naver.com/search.nhn?sLn=kr&searchOption=all&query=";

this.search = function (term, callback) {
    var url = NAVER_ENDIC_URL+encodeURIComponent(term);
    console.log(url);
    x(url,".fnt_k05")(function(err,value){
        value = value.replace(/ *\([^)]*\) */, "");
        console.log(value.trim());
        callback(value.trim())
    });
};


