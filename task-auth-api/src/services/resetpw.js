// resetpw.js
const { createResponse } = require('./response-code');
const { validatePassword, hashPassword } = require('./common');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { responseCodes, responseMessages } = require('./response-code');

const resetPassword = async (event) => {
  const { email, otp, newPassword } = JSON.parse(event.body);

  // Validate password
  if (!validatePassword(newPassword)) {
    return createResponse(responseCodes.BAD_REQUEST, responseMessages.PASSWORD_CRITERIA);
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { email },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      return createResponse(responseCodes.NOT_FOUND, responseMessages.USER_NOT_FOUND);
    }

    // Verify OTP
    if (result.Item.resetOtp !== otp) {
      return createResponse(responseCodes.BAD_REQUEST, responseMessages.INVALID_OTP);
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    const updateParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: { email },
      UpdateExpression: 'SET password = :password, resetOtp = :resetOtp',
      ExpressionAttributeValues: {
        ':password': hashedPassword,
        ':resetOtp': null,
      },
    };

    await dynamoDB.update(updateParams).promise();

    return createResponse(responseCodes.SUCCESS, responseMessages.PASSWORD_RESET_SUCCESS);
  } catch (error) {
    console.error('Error during reset password:', error);
    return createResponse(responseCodes.INTERNAL_SERVER_ERROR, responseMessages.ERROR);
  }
};

module.exports = { resetPassword };
