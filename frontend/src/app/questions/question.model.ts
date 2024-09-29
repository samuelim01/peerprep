export interface QuestionResponse {
    status: string;
    message: string;
    data?: Question[] | null;
}

export interface SingleQuestionResponse {
    status: string;
    message: string;
    data: Question;
}

export interface UploadQuestionsResponse {
    status: string;
    message: string;
    data: Question[];
}

export interface Question {
    id: number;
    description: string;
    difficulty: string;
    title: string;
    topics?: string[];
}

export interface QuestionBody {
    description?: string;
    difficulty?: string;
    title?: string;
    topics?: string[];
}
