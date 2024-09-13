export const PORT = 8081;
export const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
export const MONGODB_URL = 'mongodb://question-db:27017';
export const MONGODB_DATABASE = 'question';

export const corsOptions = {
    origin: process.env.corsOrigin ?? true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Request-With', 'Content-Type', 'Accept', 'Authorization'],
};
