const rp = require('request-promise');
const { WebClient } = require('@slack/web-api');

const indexChannel = 'index-log';

async function unindexedEntries(dbAPI) {
    let entries = await dbAPI.fetchUnIndexedEntries();

    let log = [];
    await Promise.all(entries.map(async function (entry) {
        console.log("CRON: Adding " + entry.id);
        let url = encodeURI(process.env.INDEX_URL + entry.id);
        await rp({ uri: url, json: true}).then(function () {
            console.log("CRON: SUCCEEDED " + entry.id);
            log.push({ id: entry.id, success: true});
        }).catch(function () {
            console.log("CRON: FAILED " + entry.id);
            log.push({ id: entry.id, success: false});
        });
    }));

    return log;
}

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
    unindexedEntries: unindexedEntries,
    logIndexingMsg: logIndexingMsg
};