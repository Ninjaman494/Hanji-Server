require('dotenv').config();
require('@google-cloud/debug-agent').start();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const {
  createRateLimitDirective,
  createRateLimitTypeDef,
  defaultKeyGenerator,
} = require('graphql-rate-limit-directive');
const DatabaseAPI = require('./datasources/database');
const ConjugationAPI = require('./datasources/conjugation');
const SearchAPI = require('./datasources/search');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Source: https://github.com/ravangen/graphql-rate-limit/blob/master/examples/context/index.js
// Creates a unique key based on ip address and endpoint being accessed
const keyGenerator = (directiveArgs, obj, args, context, info) =>
  `${context.ip}:${defaultKeyGenerator(
    directiveArgs,
    obj,
    args,
    context,
    info
  )}`;

let dbAPI = new DatabaseAPI();
const server = new ApolloServer({
  typeDefs: [createRateLimitTypeDef(), typeDefs],
  resolvers,
  context: ({ req }) => ({ ip: req.ip }),
  schemaDirectives: {
    rateLimit: createRateLimitDirective({
      keyGenerator,
    }),
  },
  dataSources: () => ({
    databaseAPI: dbAPI,
    conjugationAPI: new ConjugationAPI(),
    searchAPI: new SearchAPI(dbAPI),
  }),
});

// Required for min_instances
const app = express();
server.applyMiddleware({ app });
app.get('/_ah/warmup', (req, res) => {
  res.send('All warmed up!');
});

app.get('/uptime', (req, res) => {
  res.send('Still up!');
});

const PORT = process.env.PORT || 4000;
app.listen({ port: PORT }, (url) => {
  console.log('Server ready at ' + url);
});

// Implement String.format. First, check if it isn't implemented already.
if (!String.prototype.format) {
  String.prototype.format = function () {
    const args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}
