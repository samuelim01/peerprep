import mongoose from 'mongoose';
import { IQuestion, Question } from './questionModel';

export async function connectToDB() {
    const mongoURI = process.env.DB_URI;

    console.log('MongoDB URI:', mongoURI);

    if (!mongoURI) {
        throw new Error('MongoDB URI not specified');
    } else if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
        throw Error('MongoDB credentials not specified');
    }

    await mongoose.connect(mongoURI, {
        authSource: 'admin',
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
    });
}

export async function upsertManyQuestions(questions: IQuestion[]) {
    const ops = questions.map(item => ({
        updateOne: {
            filter: { id: item.id },
            update: item,
            upsert: true,
        },
    }));
    await Question.bulkWrite(ops);
}
