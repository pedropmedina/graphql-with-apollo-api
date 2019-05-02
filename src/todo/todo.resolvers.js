/* eslint-disable no-console */
const AWS = require('aws-sdk');
const moment = require('moment');
const uuidv4 = require('uuid/v4');

AWS.config.update({ region: 'us-east-2' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

// get all todos
const getTodos = async () => {
  try {
    const todos = await dynamodb
      .query({
        TableName: process.env.DYNAMODB_TABLE,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': 'pedro'
        }
      })
      .promise();
    return todos.Items;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

// get single todo
const getTodo = async (_, args) => {
  try {
    const todo = await dynamodb
      .query({
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: 'todoIndex',
        Limit: 1,
        KeyConditionExpression: 'userId = :uid and todoId = :tid',
        ExpressionAttributeValues: {
          ':uid': 'pedro',
          ':tid': args.id
        }
      })
      .promise();
    return todo.Items[0];
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

// add todo to db
const addTodo = async (_, args) => {
  // userId, todoId, description, createdAt, category
  try {
    const itemValues = {
      ...args.input,
      todoId: uuidv4(),
      createdAt: moment().unix()
    };
    await dynamodb
      .put({
        TableName: process.env.DYNAMODB_TABLE,
        Item: itemValues
      })
      .promise();
    return itemValues;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

// update todo in db
const updateTodo = async (_, { input }) => {
  try {
    const { userId, todoId, createdAt, description } = input;
    await dynamodb
      .update({
        TableName: process.env.DYNAMODB_TABLE,
        Key: { userId, createdAt },
        UpdateExpression: 'set #desc = :desc',
        ExpressionAttributeNames: { '#desc': 'description' },
        ExpressionAttributeValues: { ':desc': description }
      })
      .promise();

    // query for the updated todo
    const data = await dynamodb
      .query({
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: 'todoIndex',
        Limit: 1,
        KeyConditionExpression: '#uid = :uid and #tid = :tid',
        ExpressionAttributeNames: { '#uid': 'userId', '#tid': 'todoId' },
        ExpressionAttributeValues: { ':uid': userId, ':tid': todoId }
      })
      .promise();
    return data.Items[0];
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

// delete todo
const deleteTodo = async (_, args) => {
  try {
    const { userId, createdAt } = args.input;
    const data = await dynamodb
      .delete({
        TableName: process.env.DYNAMODB_TABLE,
        Key: { userId, createdAt },
        ReturnValues: 'ALL_OLD'
      })
      .promise();
    return data.Attributes;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

module.exports = {
  Query: {
    getTodos,
    getTodo
  },
  Mutation: {
    addTodo,
    updateTodo,
    deleteTodo
  }
};
