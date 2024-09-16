import { model, Schema } from 'mongoose';

enum Difficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
}

export interface IQuestion {
    id: number;
    title: string;
    description: string;
    categories: [string];
    difficulty: Difficulty;
}

const questionSchema = new Schema<IQuestion>(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        categories: {
            type: [String],
            required: true,
        },
        difficulty: {
            type: String,
            required: true,
            enum: ['Easy', 'Medium', 'Difficult'],
        },
    },
    { versionKey: false },
);

export const Question = model<IQuestion>('Question', questionSchema);
