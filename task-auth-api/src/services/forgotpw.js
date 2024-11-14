// forgotpw.js
const { sendOtpEmail } = require('./mail.config');
const { createResponse } = require('./response-code');
const { responseCodes, responseMessages } = require('./response-code');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const crypto = require('crypto');

const forgotPassword = async (event) => {
  const { email } = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { email },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      return createResponse(responseCodes.NOT_FOUND, responseMessages.USER_NOT_FOUND);
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in DynamoDB
    const updateParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: { email },
      UpdateExpression: 'SET resetOtp = :otp, otpTimestamp = :timestamp',
      ExpressionAttributeValues: {
        ':otp': otp,
        ':timestamp': Date.now(),
      },
    };

    await dynamoDB.update(updateParams).promise();

    // Send OTP email
    await sendOtpEmail(email, otp);

    return createResponse(responseCodes.SUCCESS, responseMessages.OTP_SENT);
  } catch (error) {
    console.error('Error during forgot password:', error);
    return createResponse(responseCodes.INTERNAL_SERVER_ERROR, responseMessages.ERROR);
  }
};

module.exports = { forgotPassword };
