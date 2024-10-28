import { Queues } from './queues';
import messageBroker from './broker';
import { createRoomWithQuestion } from '../controllers/roomController';
import { QuestionFoundEvent } from '../types/event';

async function consumeQuestionFound(message: QuestionFoundEvent) {
    const { user1, user2, question } = message
    
    const { requestId: requestId1 } = user1;
    const { requestId: requestId2 } = user2;

    const roomId = await createRoomWithQuestion(user1, user2, question);
    if (roomId) {
        console.log(`Room created successfully with ID: ${roomId}`);

        const collabCreatedMessage = {
            requestId1,
            requestId2,
            collabId: roomId,
            question,
        };

        console.log(
            `Message to be produced to COLLAB_CREATED queue: ${JSON.stringify(collabCreatedMessage)}`,
        );

        await messageBroker.produce(Queues.COLLAB_CREATED, collabCreatedMessage);

        console.log(`Message sent to COLLAB_CREATED queue: ${JSON.stringify(collabCreatedMessage)}`);
    } else {
        console.log('Failed to create room.');
    }
}

export async function initializeConsumers() {
    messageBroker.consume(Queues.QUESTION_FOUND, consumeQuestionFound);
}
