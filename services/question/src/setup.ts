import fs from 'fs/promises';
import Question, { IQuestion } from './models/questionModel';

const getQuestions = async (): Promise<IQuestion[]> => {
    const data = await fs.readFile('./src/config/questions.json', { encoding: 'utf8' });
    return JSON.parse(data);
}

const syncQuestions = async () => {
    try {
        const questions = await getQuestions();
        const ops = questions.map(item => ({
            updateOne: {
                filter: { id: item.id },
                update: item,
                upsert: true,
            }
        }));
        await Question.bulkWrite(ops);
        console.log('Questions synced successfully')
    } catch (error) {
        if (error instanceof Error) {
            console.log('Error syncing questions: ', error.message);
        } else {
            console.log('Error syncing questions');
        }
        process.exit(1);
    }
}

export default syncQuestions;
