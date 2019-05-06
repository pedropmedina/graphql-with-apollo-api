/* eslint-disable no-console */
const jwtDecode = require('jwt-decode');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-2' });

const cognitoidentity = new AWS.CognitoIdentity();

const IdentityPoolId = process.env.COGNITO_IDENTITY_POOL_ID;

const signup = async (_, args) => {
  try {
    let id_token = args.id;

    let params = {
      IdentityPoolId,
      Logins: {
        'accounts.google.com': id_token
      }
    };

    // Cognito will generate a new id when new user, else it will
    // return the id for the existing user
    let data = await cognitoidentity.getId(params).promise();

    params = {
      IdentityId: data.IdentityId,
      Logins: {
        'accounts.google.com': id_token
      }
    };
    data = await cognitoidentity.getCredentialsForIdentity(params).promise();

    let decoded = jwtDecode(id_token);

    data.username = decoded.name;

    console.log('data ---> ', data);
    return 'Signup completed';
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  Mutation: {
    signup
  }
};
