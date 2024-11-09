import { DifficultyLevels } from '../../questions/difficulty-levels.enum';

export enum statusValues {
    COMPLETED = 'COMPLETED',
    FORFEITED = 'FORFEITED',
    IN_PROGRESS = 'IN_PROGRESS',
}

export interface MatchingHistory {
    id: string;
    collaborator: string; // collaborator username
    question: string; // question title
    difficulty: DifficultyLevels; // question difficulty
    topics: string[]; // question topics
    status: statusValues; // status of the session
    time: string; // time of the session
}

export interface User {
    username: string;
    _id: string;
}

export interface Question {
    id: number;
    title: string;
    description: string;
    topics: string[];
    difficulty: DifficultyLevels;
    _id: string;
}

export interface sessionHistory {
    _id: string;
    roomId: string;
    user: User;
    collaborator: User;
    question: Question;
    status: statusValues;
    createdAt: string;
    updatedAt: string;
}

export interface historyResponse {
    status: statusValues;
    message: string;
    data: sessionHistory[];
}
