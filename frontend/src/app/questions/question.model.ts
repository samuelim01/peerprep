export interface Question {
    id?: number;
    title?: string;
    description?: string;
    topics?: string[];
    difficulty?: string;
}

export interface Column {
    field: string;
    header: string;
}

export interface Topic {
    label: string;
    value: string;
}

export interface Difficulty {
    label: string;
    value: string;
}
