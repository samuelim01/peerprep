const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    title: String,
    description: String,
    categories: [String],
    complexity: String,
}, { versionKey: false });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
