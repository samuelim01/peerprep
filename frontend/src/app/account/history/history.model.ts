export interface MatchingHistory {
    id: string;
    collaborator: string; // collaborator username
    question: string; // question title
    difficulty: string; // question difficulty
    topics: string[]; // question topics
    status: string; // status of the session
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
    difficulty: string;
    _id: string;
}

export interface sessionHistory {
    _id: string;
    roomId: string;
    user: User;
    collaborator: User;
    question: Question;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface historyResponse {
    status: string;
    message: string;
    data: sessionHistory[];
}
