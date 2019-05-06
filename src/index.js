/* eslint-disable no-console */
const { ApolloServer } = require('apollo-server-lambda');
const _ = require('lodash');

const { todoDefs, todoResolvers } = require('./todo');
const { authDefs, authResolvers } = require('./auth');
const typeDefs = [todoDefs, authDefs].join(' ');
const resolvers = _.merge({}, todoResolvers, authResolvers);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) =>
    console.log(context) || {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context
    },
  uploads: false,
  playground: process.env.NODE_ENV === 'prod' ? false : true,
  introspection: process.env.NODE_ENV === 'prod' ? false : true
});

exports.graphqlHandler = server.createHandler({
  cors: { origin: '*', credentials: 'true' }
});
