require('dotenv').config();
require('@google-cloud/debug-agent').start();
const cron = require('node-cron');
const express = require('express');
const DatabaseAPI = require('./datasources/database');
const ConjugationAPI = require('./datasources/conjugation');
const SearchAPI = require('./datasources/search');
const resolvers = require('./resolvers');
const cronjobs = require('./cronjobs');

const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
let dbAPI = new DatabaseAPI();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        databaseAPI: dbAPI,
        conjugationAPI: new ConjugationAPI(),
        searchAPI: new SearchAPI(dbAPI)
    })
});

// Every day at 5:00 PM EST
/*cron.schedule("0 17 * * *", function() {
    console.log("CRON: Checking for un-indexed entries...");
    cronjobs.unindexedEntries(dbAPI).then(function (result) {
        console.log("CRON: Finished checking for un-index entries");
        cronjobs.logIndexingMsg(result);
    }, {
        scheduled: true,
        timezone: "America/New_York"
    })
});*/

// Required for min_instances
const app = express();
server.applyMiddleware({ app });
app.get('/_ah/warmup', (req, res) => {
   res.send('All warmed up!');
});

app.get('/uptime', (req, res) => {
   res.send('Still up!')
});

const PORT = process.env.PORT || 4000;
app.listen({ port: PORT },(url) => {
   console.log('Server ready at '+url)
});

// Implement String.format. First, check if it isn't implemented already.
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