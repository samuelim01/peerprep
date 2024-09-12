const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: String,
    description: String,
    categories: [String],
    complexity: String,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
