/* eslint-disable no-console */
const { ApolloServer } = require('apollo-server-lambda');
const _ = require('lodash');

const { todoDefs, todoResolvers } = require('./todo');
const typeDefs = [todoDefs].join(' ');
const resolvers = _.merge(todoResolvers);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context
  }),
  playground: process.env.NODE_ENV === 'prod' ? false : true,
  introspection: process.env.NODE_ENV === 'prod' ? false : true
});

exports.graphqlHandler = server.createHandler({
  cors: { origin: '*', credentials: 'true' }
});
