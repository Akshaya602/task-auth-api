const responseCodes = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  };
  
  const responseMessages = {
    USER_CREATED: 'User registered successfully!',
    USER_EXISTS: 'Email already exists.',
    LOGIN_SUCCESS: 'Login successful!',
    ACCOUNT_NOT_FOUND: 'Account not found.',
    PASSWORD_INCORRECT: 'Password incorrect.',
    OTP_SENT: 'OTP sent to your email',
    USER_NOT_FOUND: 'User not found',
    INVALID_OTP: 'Invalid OTP',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
    PASSWORD_CRITERIA: 'Password does not meet criteria.',
    ERROR: 'An error occurred.',
  };

  const createResponse = (statuscode, message, additionalArgs = {}) => {
    const response = {
      statusCode: statuscode,
      body: JSON.stringify({
        message: message,
        ...additionalArgs,
      }),
    };
  
    return response;
  };

  module.exports = {
    responseCodes,
    responseMessages,
    createResponse,
  };