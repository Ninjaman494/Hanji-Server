// Env has to be imported this way to work in other files
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { start } from '@google-cloud/debug-agent';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { createServer } from 'http';
import {
  createRateLimitDirective,
  createRateLimitTypeDef,
  defaultKeyGenerator,
} from 'graphql-rate-limit-directive';
import { graphqlUploadExpress } from 'graphql-upload';
import typeDefs from './schema';
import {
  BugReport,
  Entry,
  EntrySuggestion,
  Favorite,
  Search,
  Survey,
  WOD,
  bugReportResolvers,
  conjugationResolvers,
  entryResolvers,
  entrySuggestionResolvers,
  favoriteResolvers,
  searchResolvers,
  surveyResolvers,
  wodResolvers,
  Conjugation,
} from 'features';
import { merge } from 'lodash';
import { connectDB } from 'datasources/databaseWrapper';

const Query = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

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
  const expressApp = express();
  const httpServer = createServer(expressApp);

  const mongo = await connectDB();

  const apolloServer = new ApolloServer({
    typeDefs: [
      createRateLimitTypeDef(),
      Query,
      BugReport,
      Conjugation,
      Entry,
      EntrySuggestion,
      Favorite,
      Search,
      Survey,
      WOD,
    ],
    resolvers: merge(
      bugReportResolvers,
      conjugationResolvers,
      entryResolvers,
      entrySuggestionResolvers,
      favoriteResolvers,
      searchResolvers,
      surveyResolvers,
      wodResolvers,
    ),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => ({ ip: req.ip }),
    schemaDirectives: {
      rateLimit: createRateLimitDirective({
        keyGenerator,
      }),
    },
  } as any);

  await apolloServer.start();

  // Required for min_instances
  expressApp.get('/_ah/warmup', (req, res) => {
    res.send('All warmed up!');
  });

  expressApp.get('/uptime', (req, res) => {
    res.send('Still up!');
  });

  expressApp.use(graphqlUploadExpress());
  apolloServer.applyMiddleware({ app: expressApp });

  const PORT = process.env.PORT || 4000;
  httpServer.listen({ port: PORT }, () => {
    console.log('Server ready');
  });
};

start();
startServer();
