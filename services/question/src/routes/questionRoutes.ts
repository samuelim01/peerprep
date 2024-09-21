import {Router} from 'express';
import {
    getQuestions,
    getQuestionById,
    getQuestionByParameters,
    getTopics,
    addQuestion,
    deleteQuestion,
    updateQuestion
} from '../controllers/questionController';

/**
 * All the routes related to questions.
 * All the comments are happy scenarios.
 */

const questionRouter = Router();

/**
 * curl -X GET "http://localhost:8081/questions/search?topics=Algorithms&difficulty=Medium"
 * curl -X GET "http://localhost:8081/questions/search?topics=Algorithms,Data%20Structures&difficulty=Easy&limit=5"
 */
questionRouter.get('/search', getQuestionByParameters);

/**
 * curl -X GET http://localhost:8081/topics
 */
questionRouter.get('/topics', getTopics);

/**
 * curl -X GET http://localhost:8081/questions
 * curl -X GET "http://localhost:8081/questions?title=Reverse%20a%20String"
 * curl -X GET "http://localhost:8081/questions?description=string"
 * curl -X GET "http://localhost:8081/questions?topics=Algorithms,Data%20Structures"
 * curl -X GET "http://localhost:8081/questions?difficulty=Easy"
 * curl -X GET "http://localhost:8081/questions?title=Reverse%20a%20String&difficulty=Easy"
 * curl -X GET "http://localhost:8081/questions?description=string&topics=Algorithms"
 * curl -X GET "http://localhost:8081/questions?title=Reverse%20a%20String&description=string&topics=Algorithms&difficulty=Easy"
 */
questionRouter.get('/', getQuestions);

/**
 * curl -X GET http://localhost:8081/questions/1
 */
questionRouter.get('/:id', getQuestionById);

/**
 * curl -X POST http://localhost:8081/questions \
 *     -H "Content-Type: application/json" \
 *     -d '{
 *           "id": 21,
 *           "title": "New Question",
 *           "description": "This is a description for a new question.",
 *           "topics": ["Data Structures", "Algorithms"],
 *           "difficulty": "Medium"
 *         }'
 */
questionRouter.post('/', addQuestion);

/**
 * curl -X PUT http://localhost:8081/questions/21 \
 *     -H "Content-Type: application/json" \
 *     -d '{
 *           "title": "Updated Question Title",
 *           "description": "This is the updated description.",
 *           "topics": ["Updated Topic"],
 *           "difficulty": "Hard"
 *         }'
 */
questionRouter.put('/:id', updateQuestion);

/**
 * curl -X DELETE http://localhost:8081/questions/21
 */
questionRouter.delete('/:id', deleteQuestion);

export default questionRouter;
