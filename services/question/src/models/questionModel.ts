import { model, Schema } from 'mongoose';

export interface IQuestion {
    id: number;
    title: String;
    description: String;
    categories: [String];
    complexity: String;
}

const questionSchema = new Schema<IQuestion>({
    id: { type: Number, required: true, unique: true },
    title: String,
    description: String,
    categories: [String],
    complexity: { type: String, enum: ['Easy', 'Medium', 'Difficult'] },
}, { versionKey: false });

const Question = model<IQuestion>('Question', questionSchema);

export default Question;
