export interface MatchingHistory {
    id: number;
    collaborator: string; // collaborator username
    question: string; // question title
    difficulty: string; // question difficulty
    topics: string[]; // question topics
    status: string; // status of the session
    time: string; // time of the session
}
