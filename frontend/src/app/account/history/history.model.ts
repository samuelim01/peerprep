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
    time: string | null; // time of the session
    language: string | undefined; // language used during the session
    code: string | undefined; // code written during the session
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

export interface Snapshot {
    language: string;
    code: string;
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
    snapshot?: Snapshot;
}

export interface historyResponse {
    status: statusValues;
    message: string;
    data: sessionHistory[];
}
