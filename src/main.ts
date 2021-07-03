// Env has to be imported this way to work in other files
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { start } from '@google-cloud/debug-agent';
import express from 'express';
import { ApolloServer, SchemaDirectiveVisitor } from 'apollo-server-express';
import {
  createRateLimitDirective,
  createRateLimitTypeDef,
  defaultKeyGenerator,
} from 'graphql-rate-limit-directive';
import DatabaseAPI from './datasources/database';
import ConjugationAPI from './datasources/conjugation';
import SearchAPI from './datasources/search';
import resolvers from './resolvers';
import typeDefs from './schema';

start();

// Source: https://github.com/ravangen/graphql-rate-limit/blob/master/examples/context/index.js
// Creates a unique key based on ip address and endpoint being accessed
const keyGenerator = (directiveArgs, obj, args, context, info) =>
  `${context.ip}:${defaultKeyGenerator(
    directiveArgs,
    obj,
    args,
    context,
    info,
  )}`;

const dbAPI = new DatabaseAPI();
const server = new ApolloServer({
  typeDefs: [createRateLimitTypeDef(), typeDefs],
  resolvers,
  context: ({ req }) => ({ ip: req.ip }),
  schemaDirectives: {
    rateLimit: createRateLimitDirective({
      keyGenerator,
    }) as unknown as typeof SchemaDirectiveVisitor,
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
app.listen({ port: PORT }, () => {
  console.log('Server ready');
});
