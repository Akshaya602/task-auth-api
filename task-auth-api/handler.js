import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { handleRoute } from './src/routes/routes.js';  // Import the routes from your routes file

// Initialize the Express app
const app = express();

// Middleware setup
app.use(express.urlencoded({ limit: '1mb', extended: true }));  // Handle URL-encoded data
app.use(express.json({ limit: '1mb' }));  // Handle JSON data

// CORS setup to allow all origins
app.use(cors());

// Handle preflight requests
app.options('*', cors());

// Add headers to all responses (to handle CORS)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or specify a particular origin
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes setup
app.use('/', handleRoute);  // Route all requests to your defined routes

// Catch-all route to handle undefined paths (you can customize the message)
app.get('*', (req, res) => {
  res.status(200).send('Welcome');
});

// Export the serverless handler
const handler = serverless(app);
export { handler };
