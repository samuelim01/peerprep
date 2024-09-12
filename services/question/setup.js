const fs = require('fs/promises');
const Question = require('./models/questionModel');

const getQuestions = async () => {
    const data = await fs.readFile('./config/questions.json', { encoding: 'utf8' });
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
    } catch {
        console.log('Error syncing questions: ', error.message);
        process.exit(1);
    }
}

module.exports = syncQuestions;