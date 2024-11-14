// signin.js
const { createResponse } = require('./response-code');
const { validateEmail, comparePassword } = require('./common');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { responseCodes, responseMessages } = require('./response-code');

const signin = async (event) => {
  const { email, password } = JSON.parse(event.body);

  // Validate email
  if (!validateEmail(email)) {
    return createResponse(responseCodes.BAD_REQUEST, 'Invalid email format.');
  }

  // Validate password
  if (!password || password.length < 8) {
    return createResponse(responseCodes.BAD_REQUEST, 'Password is required and must be at least 8 characters long.');
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { email },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      return createResponse(responseCodes.NOT_FOUND, responseMessages.ACCOUNT_NOT_FOUND);
    }

    // Compare the hashed password
    const isValidPassword = await comparePassword(password, result.Item.password);
    if (!isValidPassword) {
      return createResponse(responseCodes.UNAUTHORIZED, responseMessages.PASSWORD_INCORRECT);
    }

    return createResponse(responseCodes.SUCCESS, responseMessages.LOGIN_SUCCESS);
  } catch (error) {
    console.error('Error during signin:', error);
    return createResponse(responseCodes.INTERNAL_SERVER_ERROR, responseMessages.ERROR);
  }
};

module.exports = { signin };
