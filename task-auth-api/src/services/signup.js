// signup.js
const { createResponse } = require('./response-code');
const { validateEmail, validatePassword, hashPassword } = require('./common');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { responseCodes, responseMessages } = require('./response-code');

const signup = async (event) => {
  const { email, password, confirmPassword } = JSON.parse(event.body);

  // Validate email
  if (!validateEmail(email)) {
    return createResponse(responseCodes.BAD_REQUEST, 'Invalid email format.');
  }

  // Validate password
  if (!validatePassword(password)) {
    return createResponse(responseCodes.BAD_REQUEST, responseMessages.PASSWORD_CRITERIA);
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return createResponse(responseCodes.BAD_REQUEST, 'Passwords do not match.');
  }

  // Check if email already exists
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { email },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    if (result.Item) {
      return createResponse(responseCodes.BAD_REQUEST, responseMessages.USER_EXISTS);
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    const putParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        email,
        password: hashedPassword,
      },
    };

    await dynamoDB.put(putParams).promise();

    return createResponse(responseCodes.CREATED, responseMessages.USER_CREATED);
  } catch (error) {
    console.error('Error during signup:', error);
    return createResponse(responseCodes.INTERNAL_SERVER_ERROR, responseMessages.ERROR);
  }
};

module.exports = { signup };
