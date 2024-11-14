// Import functions from respective files
const { signup } = require('./signup');
const { signin } = require('./signin');
const { forgotPassword } = require('./forgotpw');
const { resetPassword } = require('./resetpw');

// This object maps the route paths to the corresponding function
const router = {
  '/signup': signup,
  '/signin': signin,
  '/forgot-password': forgotPassword,
  '/reset-password': resetPassword,
};

// Function to handle routing based on the event path
const handleRoute = async (event) => {
  const { path } = event; // The path from the event triggers (i.e., /signup, /signin, etc.)

  // If the route exists in the routes object, call the corresponding function
  if (router[path]) {
    return await routes[path](event); 
  }

  
  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Route not found' }),
  };
};

module.exports = { handleRoute };
