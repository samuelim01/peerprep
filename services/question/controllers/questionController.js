const Question = require('../models/questionModel');

const getQuestions = async (req, res) => {
    const questions = await Question.find();
    const questionTitles = questions.map(q => q.title);
    res.status(200).json({
        message: 'These are all the question titles:' + questionTitles,
    });
    return;
};

module.exports = getQuestions;