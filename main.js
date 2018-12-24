const DatabaseAPI = require('./datasources/database');
const ConjugationAPI = require('./datasources/conjugation');
const resolvers = require('./resolvers');

const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert('hanji-bd63d-849ae0babd80.json')
});
const db = admin.firestore();

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        databaseAPI: new DatabaseAPI(db),
        conjugationAPI: new ConjugationAPI(),
    })
});

server.listen().then( ({url}) => {
   console.log('Server ready at '+url)
});

// Implment String.format. First, check if it isn't implemented already.
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