// Env has to be imported this way to work in other files
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { start } from '@google-cloud/debug-agent';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import {
  createRateLimitDirective,
  createRateLimitTypeDef,
  defaultKeyGenerator,
} from 'graphql-rate-limit-directive';
import { graphqlUploadExpress } from 'graphql-upload';
import DatabaseAPI from './datasources/database';
import ConjugationAPI from './datasources/conjugation';
import SearchAPI from './datasources/search';
import resolvers from './resolvers';
import typeDefs from './schema';
import SlackAPI from './datasources/slack';
import { MongoClient } from 'mongodb';

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

const startServer = async () => {
  const mongo = new MongoClient(process.env.MONGO_URL);
  await mongo.connect();

  const dbAPI = new DatabaseAPI(mongo);
  const apolloServer = new ApolloServer({
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
      slackAPI: new SlackAPI(),
    }),
  } as any);

  await apolloServer.start();

  // Required for min_instances
  const expressApp = express();
  expressApp.get('/_ah/warmup', (req, res) => {
    res.send('All warmed up!');
  });

  expressApp.get('/uptime', (req, res) => {
    res.send('Still up!');
  });

  expressApp.use(graphqlUploadExpress());
  apolloServer.applyMiddleware({ app: expressApp });

  const PORT = process.env.PORT || 4000;
  expressApp.listen({ port: PORT }, () => {
    console.log('Server ready');
  });
};

start();
startServer();
