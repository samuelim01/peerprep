const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: String,
    description: String,
    categories: [String],
    complexity: { type: String, enum: ['Easy', 'Medium', 'Difficult'] },
}, { versionKey: false });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
