import express, { Express } from 'express';
import router from './routes';
import questionRouter from './routes/questionRoutes';
import connectDb from './models';
import syncQuestions from './setup';
import mongoose from 'mongoose';

const app: Express = express();

// Establish database connection
connectDb();
mongoose.connection.once('open', async () => await syncQuestions());

// Middleware

// Routes
app.use('/', router);
app.use('/', questionRouter);

export default app;
