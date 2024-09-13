import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes';
import questionRouter from './routes/questionRoutes';
import { syncQuestions } from './setup';
import { connectDb } from './models';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { corsOptions } from './config';

const app: Express = express();

// Establish database connection
connectDb();
mongoose.connection.once('open', async () => await syncQuestions());

// Middleware
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors(corsOptions));

// Routes
app.use('/', router);
app.use('/', questionRouter);

export default app;
