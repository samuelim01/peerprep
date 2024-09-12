const express = require('express');
const router = require('./routes');
const questionRouter = require('./routes/questionRoutes');
const connectDb = require('./models');

const app = express();

// Establish database connection
connectDb();

// Middleware

// Routes
app.use('/', router);
app.use('/', questionRouter);

module.exports = app;
