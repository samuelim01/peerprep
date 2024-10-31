import { model, Schema, Types } from 'mongoose';

export type IdType = Types.ObjectId | string;

export enum Difficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
}

export enum HistoryStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    FORFEITED = 'FORFEITED',
    COMPLETED = 'COMPLETED',
}

export interface User {
    id: Types.ObjectId;
    username: string;
}

export interface Question {
    id: number;
    title: string;
    description: string;
    topics: [string];
    difficulty: Difficulty;
}

export interface History {
    roomId: Types.ObjectId;
    user: User;
    collaborator: User;
    question: Question;
    status: HistoryStatus;
}

const userSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
    },
});

const questionSchema = new Schema<Question>({
    id: {
        type: Number,
        required: true,
        unique: true,
        immutable: true,
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
    topics: {
        type: [String],
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard'],
    },
});

const historySchema = new Schema<History>(
    {
        user: userSchema,
        collaborator: userSchema,
        question: questionSchema,
        status: {
            type: String,
            enum: Object.values(HistoryStatus),
            default: HistoryStatus.IN_PROGRESS,
        },
    },
    { timestamps: true },
);

export const HistoryModel = model<History>('History', historySchema);
