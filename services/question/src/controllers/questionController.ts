import { Response } from 'express';
import { Question } from '../models/questionModel';

export const getQuestions = async (res: Response) => {
    const questions = await Question.find();
    const questionTitles = questions.map(q => q.title);
    res.status(200).json({
        message: 'These are all the question titles:' + questionTitles,
    });
    return;
};
