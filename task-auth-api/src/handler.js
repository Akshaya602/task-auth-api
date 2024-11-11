//required
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs'); 
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const crypto = require('crypto');
const nodemailer = require('nodemailer'); 
const { eventNames } = require('process');

//regex for email and password
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[A-Za-z\d!@#$%^&*]{8,}$/;

//SIGN_UP
const signup = async(event) =>{
    const { email, password, confirmPassword } = JSON.parse(event.body);

    // Validate input
    if (!email || !password || !confirmPassword) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Email, password, and confirm password are required.' }),
        };
    }

    // validate email
    if (!emailRegex.test(email)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid email format.' }),
        };
    }

    //Passwords match
    if (password !== confirmPassword) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Passwords do not match.' }),
        };
    }

    // validate password
    if (!passwordRegex.test(password)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Password must be at least 8 characters long and contain at least one number,one special symbol and one uppercase letter.Ensure the criteria' }),
        };
    }
 
    //email verification
    const getParams = {
        TableName: 'UserInfo',
        Key: { email },
    };

    try {
        const getResult = await dynamoDB.get(getParams).promise();
        
        if (getResult.Item) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email already exist.' }),
            };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const params = {
            TableName: 'UserInfo',
            Item: {
                email,
                password: hashedPassword,
            },
        };

        await dynamoDB.put(params).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User registered successfully!' }),
        };
    } catch (error) {
        console.error('Error during signup:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not create user.' }),
        };
    }
};

//SIGN_IN
const signin=async(event)=>{
    const { email, password } = JSON.parse(event.body);

    const params = {
        TableName: 'UserInfo',
        Key: { email },
    };

    try {
        const result = await dynamoDB.get(params).promise();
        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Account not found.' }),
            };
        }

        const isValidPassword = await bcrypt.compare(password, result.Item.password);
        if (!isValidPassword) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Password incorrect.' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Login successful!' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not log in.' }),
        };
    }
};

//FORGOT_PASSWORD
const forgotPassword = async(event) =>{
    const { email } = JSON.parse(event.body);

    // Check if email already exists
    const params = {
      TableName: 'UserInfo',
      Key: {
        email,
      },
    };
  
    try {
      const data = await dynamoDB.get(params).promise();
  
      if (!data.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'User not found' }),
        };
      }
  
      // OTP generation
      const otp = crypto.randomInt(100000, 999999).toString(); 
  
      
      const updateParams = {
        TableName: 'UserInfo',
        Key: {
          email,
        },
        UpdateExpression: 'set resetOtp = :otp, otpTimestamp = :timestamp',
        ExpressionAttributeValues: {
          ':otp': otp,
          ':timestamp': Date.now(), 
        },
      };
  
      await dynamoDB.update(updateParams).promise();
  
      // Sender's detail
      const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: 'akshayabalu6@gmail.com', 
          pass: 'fame ydhi cpwv iiur', 
        },
      });
  
      //Mail
      const mailOptions = {
        from: 'akshayabalu6@gmail.com',
        to: email, 
        subject: 'Password Reset OTP',
        text: `Your OTP to reset the password is: ${otp}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return;
        }
        console.log('Email sent: ' + info.response);
      });
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'OTP sent to your email' }),
      };
    } catch (error) {
      console.error('Error occurred:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      };
    }
  };

  //RESET_PASSWORD
  const resetPassword=async(event)=>{
    const { email, otp, newPassword } = JSON.parse(event.body);

    // Retrieve user and OTP from DynamoDB
    const params = {
      TableName: 'UserInfo',
      Key: {
        email,
      },
    };

    if (!passwordRegex.test(newPassword)) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Password must be at least 8 characters long and should contain at least one number,one special symbol and one uppercase letter.Ensure the criteria.",
          }),
        };
      }
    
      try {
        const data = await dynamoDB.get(params).promise();
    
        // Check if user exists
        if (!data.Item) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'User not found' }),
          };
        }
    
        // Verify OTP
        if (data.Item.resetOtp !== otp) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid OTP' }),
          };
        }
    
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        // Update the password in the database
        const updateParams = {
          TableName: 'UserInfo',
          Key: {
            email,
          },
          UpdateExpression: 'set password = :password, resetOtp = :resetOtp',
          ExpressionAttributeValues: {
            ':password': hashedPassword,
            ':resetOtp': null, 
          },
        };
    
        await dynamoDB.update(updateParams).promise();
    
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Password reset successful' }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Error resetting the password' }),
        };
      }
    };

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allowing all origins or specify your frontend URL
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Credentials': 'true', // Set to true if using cookies/tokens
      },
      body: JSON.stringify({ message: 'Signup successful' }), // Success message or error message
    };
  
    return response;



module.exports={signup,signin,forgotPassword,resetPassword};


//POST - https://51njw409ek.execute-api.us-east-1.amazonaws.com/signup
//POST - https://51njw409ek.execute-api.us-east-1.amazonaws.com/signin
//POST - https://51njw409ek.execute-api.us-east-1.amazonaws.com/forgot-password
//POST - https://51njw409ek.execute-api.us-east-1.amazonaws.com/reset-password
  



