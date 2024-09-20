import { Request, Response } from 'express';
import { handleError, handleNotFound, handleBadRequest, handleSuccess } from '../utils/helpers';
import { Question } from '../models/questionModel';

/**
 * This endpoint allows the retrieval of all the questions in the database.
 * @param req
 * @param res
 */
export const getQuestions = async (req: Request, res: Response) => {
    try {
        const questions = await Question.find();

        handleSuccess(res, "All questions retrieved successfully", questions);
    } catch (error) {
        console.error('Error in getQuestions:', error);
        handleError(res, error, 'Failed to retrieve questions');
    }
};

/**
 * This endpoint allows the retrieval of the question by using the question ID.
 * @param req
 * @param res
 */
export const getQuestionById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const newId = parseInt(id, 10);
    if (isNaN(newId)) {
        return handleBadRequest(res, 'Invalid question ID');
    }

    try {
        const question = await Question.findOne({ id: newId });

        if (!question) {
            return handleNotFound(res, 'Question not found');
        }

        handleSuccess(res, "Question with ID retrieved successfully", question);
    } catch (error) {
        console.error('Error in getQuestionById:', error);
        handleError(res, error, 'Failed to retrieve question');
    }
};

/**
 * This endpoint allows the retrieval of a random question that matches the parameters provided.
 * @param req
 * @param res
 */
export const getQuestionByParameters = async (req: Request, res: Response) => {
    const { limit, topics, difficulty } = req.query;
    const stringLimit = limit as string
    const newLimit = parseInt(stringLimit, 10);

    if (!topics) {
        return handleBadRequest(res, 'Topics are required');
    }
    if (!difficulty) {
        return handleBadRequest(res, 'Difficulty is required');
    }
    if (isNaN(newLimit)) {
        return handleBadRequest(res, 'Limit must be a valid positive integer');
    }
    if (newLimit <= 0) {
        return handleBadRequest(res, 'Limit must be more than 0');
    }

    try {
        const topicsArray = (topics as string).split(',');
        const query = {
            topics: { $in: topicsArray },
            difficulty: difficulty,
        };
        const questions = await Question.find(query).limit(newLimit);

        if (!questions || questions.length === 0) {
            return handleNotFound(res, 'No questions found with the given parameters');
        }

        handleSuccess(res, "Questions with Parameters retrieved successfully", questions);
    } catch (error) {
        console.error('Error in getQuestionByParameters:', error);
        handleError(res, error, 'Failed to search for questions');
    }
};

/**
 * This endpoint retrieves all unique topics in the database (e.g. “Sorting”, “OOP”, “DFS”, etc…)
 * @param req
 * @param res
 */
export const getTopics = async (req: Request, res: Response) => {
    try {
        const topics = await Question.distinct('topics');

        if (!topics || topics.length === 0) {
            return handleNotFound(res, 'No topics found');
        }

        handleSuccess(res, "Topics retrieved successfully", topics);
    } catch (error) {
        console.error('Error in getTopics:', error);
        handleError(res, error, 'Failed to retrieve topics');
    }
};