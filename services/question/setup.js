const fs = require('fs');
const Question = require('./models/questionModel');

const getQuestions = () => {
    const data = fs.readFileSync('./config/questions.json');
    return JSON.parse(data);
}

const syncQuestions = async () => {
    try {
        const questions = getQuestions();

        const ops = questions.map(item => ({
            updateOne: {
                filter: { id: item.id },
                update: item,
                upsert: true,
            }
        }));
        Question.bulkWrite(ops);
    } catch {
        console.log('Error syncing questions: ', error.message);
        process.exit(1);
    }
}

module.exports = syncQuestions;