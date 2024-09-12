const express = require('express');
const router = require('./routes');
const questionRouter = require('./routes/questionRoutes');
const connectDb = require('./models');
const syncQuestions = require('./setup');
const mongoose = require('mongoose');

const app = express();

// Establish database connection
connectDb();
mongoose.connection.once('open', async () => await syncQuestions());

// Middleware

// Routes
app.use('/', router);
app.use('/', questionRouter);

module.exports = app;
