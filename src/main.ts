// Env has to be imported this way to work in other files
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { start } from '@google-cloud/debug-agent';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import {
  createRateLimitDirective,
  createRateLimitTypeDef,
  defaultKeyGenerator,
} from 'graphql-rate-limit-directive';
import { graphqlUploadExpress } from 'graphql-upload';
import { cert, initializeApp } from 'firebase-admin/app';
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
  General,
} from 'features';
import { merge } from 'lodash';
import bodyParser from 'body-parser';
import { connectDB } from 'datasources/databaseWrapper';
import refreshWOD from 'features/wod/refreshWOD';
import { deleteJamo } from 'features/autocorrect/edits';

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

  initializeApp({ credential: cert('hanji-bd63d-849ae0babd80.json') });

  await connectDB();

  const apolloServer = new ApolloServer({
    typeDefs: [
      createRateLimitTypeDef(),
      General,
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
  expressApp.get('/_ah/warmup', (_, res) => {
    res.send('All warmed up!');
  });

  expressApp.get('/uptime', (_, res) => {
    res.send('Still up!');
  });

  expressApp.get('/wod', async (_, res) => {
    await refreshWOD();
    res.send('Updated!');
  });

  expressApp.use(
    '/graphql',
    bodyParser.json(),
    graphqlUploadExpress(),
    expressMiddleware(apolloServer),
  );

  const PORT = process.env.PORT || 4000;
  httpServer.listen({ port: PORT }, () => {
    console.log(`Server ready on port ${PORT}`);
  });

  console.log(deleteJamo('갑시'));
};

start();
startServer();
