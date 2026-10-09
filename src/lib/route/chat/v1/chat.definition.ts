export enum ChatRequestStatus {
    REVIEW = 1,
    THINKING = 2,
    DONE = 3
}

export interface ChatStreamOption {
    message: string
    options: ChatStreamOptionList[];
}

export interface ChatStreamOptionList {
    label: string;
    value: string;
}

export interface ChatStreamResponse {
    status: ChatRequestStatus;
    action?: string;
    replies?: string[];
    totalCart?: number;
    option?: ChatStreamOption;
}