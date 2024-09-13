import { model, Schema } from 'mongoose';

export interface IQuestion {
    id: number;
    title: string;
    description: string;
    categories: [string];
    complexity: string;
}

const questionSchema = new Schema<IQuestion>(
    {
        id: { type: Number, required: true, unique: true },
        title: String,
        description: String,
        categories: [String],
        complexity: { type: String, enum: ['Easy', 'Medium', 'Difficult'] },
    },
    { versionKey: false },
);

export const Question = model<IQuestion>('Question', questionSchema);
