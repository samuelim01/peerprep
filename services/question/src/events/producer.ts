import { Question, QuestionFoundEvent, UserWithRequest } from '../types/event';
import { IdType } from '../types/request';
import messageBroker from './broker';
import { Queues } from './queues';

export async function produceQuestionFoundEvent(
    user1: UserWithRequest, user2: UserWithRequest, question: Question
) {
    const message: QuestionFoundEvent = {
        user1, user2, question
    };
    await messageBroker.produce(Queues.QUESTION_FOUND, message);
}
