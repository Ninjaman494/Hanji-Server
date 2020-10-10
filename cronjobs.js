const rp = require('request-promise');
const { WebClient } = require('@slack/web-api');

const indexChannel = 'index-log';

function logIndexingMsg(log) {
    let msg = '';
    if(log.length > 0) {
        log.forEach(entry => {
            msg += entry.id + ': ' + (entry.success ? ':heavy_check_mark:' : ':x:');
            msg += '\n';
        });
    } else {
        msg = 'No un-indexed entries were found';
    }

    const web = new WebClient(process.env.SLACK_TOKEN);
    web.chat.postMessage({ channel: indexChannel, text: msg }).then(function (res) {
        console.log('Message sent: ', res.ts); //timestamp
    });
}

module.exports = {
    logIndexingMsg: logIndexingMsg
};