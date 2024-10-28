import { Question } from '../models/questionModel';
import { MatchFoundEvent } from '../types/event';
import messageBroker from './broker';
import { produceQuestionFoundEvent } from './producer';
import { Queues } from './queues';

async function consumeMatchFound(msg: MatchFoundEvent) {
    console.log('match found consumed', msg);
    const { user1, user2, topics, difficulty} = msg;
    const questions = await Question.find({topics: {$in: topics}, difficulty}).exec();
    if (!questions.length) {
        // TODO: Handle
        console.log('No questions found for users', user1.username, user2.username)
        return;
    }

    const randQuestion = questions[Math.floor(Math.random() * questions.length)];
    console.log('question found for users', user1.username, user2.username, randQuestion);
    await produceQuestionFoundEvent(user1, user2, randQuestion);
}

export async function initializeConsumers() {
    messageBroker.consume(Queues.MATCH_FOUND, consumeMatchFound);
}
