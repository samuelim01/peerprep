export interface QuestionResponse {
    status: string;
    message: string;
    data?: Question[] | null;
}

export interface Question {
    _id: string;
    id: number;
    description: string;
    difficulty: string;
    title: string;
    topics?: string[];
}
