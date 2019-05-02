const fs = require('fs');
const path = require('path');

const todoDefs = fs.readFileSync(path.join(__dirname, 'todo.graphql'), 'utf8');
const todoResolvers = require('./todo.resolvers');

module.exports = {
  todoDefs,
  todoResolvers
};
