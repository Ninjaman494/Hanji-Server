require('dotenv').config();
const cron = require('node-cron');
const DatabaseAPI = require('./datasources/database');
const ConjugationAPI = require('./datasources/conjugation');
const SearchAPI = require('./datasources/search');
const resolvers = require('./resolvers');
const cronjobs = require('./cronjobs');

const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert('hanji-bd63d-849ae0babd80.json')
});
const settings = {timestampsInSnapshots: true}; // To remove timestamp warning
const db = admin.firestore();
db.settings(settings);

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
let dbAPI = new DatabaseAPI(db);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        databaseAPI: dbAPI,
        conjugationAPI: new ConjugationAPI(),
        searchAPI: new SearchAPI(dbAPI)
    })
});

// Every day at 11:00 AM
cron.schedule("0 11 * * *", function() {
    console.log("CRON: Checking for un-indexed entries...");
    cronjobs.unindexedEntries(dbAPI).then(function (result) {
        console.log("CRON: Finished checking for un-index entries");
        cronjobs.logIndexingMsg(result);
    })
});

const PORT = process.env.PORT || 4000;
server.listen({ port: PORT }).then( ({url}) => {
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