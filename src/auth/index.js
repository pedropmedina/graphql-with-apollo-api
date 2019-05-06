const fs = require('fs');
const path = require('path');

const authDefs = fs.readFileSync(path.join(__dirname, 'auth.graphql'), 'utf8');
const authResolvers = require('./auth.resolvers');

module.exports = {
  authDefs,
  authResolvers
};
