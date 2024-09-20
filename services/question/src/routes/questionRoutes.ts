import { Router } from 'express';
import { getQuestions, getQuestionById, getQuestionByParameters, getTopics } from '../controllers/questionController';

const questionRouter = Router();

/**
 * To Test: curl -X GET "http://localhost:8081/questions/search?topics=Algorithms,Data%20Structures&difficulty=Easy&limit=5"
 */
questionRouter.get('/search', getQuestionByParameters);

/**
 * To Test: http://localhost:8081/topics
 */
questionRouter.get('/topics', getTopics);

/**
 * To Test: http://localhost:8081/questions/
 */
questionRouter.get('/', getQuestions);

/**
 * To Test: http://localhost:8081/questions/1
 */
questionRouter.get('/:id', getQuestionById);

export default questionRouter;
