export enum ChatRequestStatus {
    REVIEW = 1,
    THINKING = 2,
    DONE = 3,
    CS_AGENT_REVIEW = 4,
    CS_AGENT_THINKING = 5,
    NAV_AGENT_REVIEW = 6,
    NAV_AGENT_THINKING = 7,
    RHETO_AGENT_REVIEW = 8,
    RHETO_AGENT_THINKING = 9
}

export const chatReqStatusFormated = (status: ChatRequestStatus) => {
    if (status === ChatRequestStatus.REVIEW) {
        return "Review...";
    } else if (status === ChatRequestStatus.THINKING) {
        return "Thinking...";
    } else if (status === ChatRequestStatus.CS_AGENT_REVIEW) {
        return "Customer agent reviewing...";
    } else if (status === ChatRequestStatus.CS_AGENT_THINKING) {
        return "Customer agent thinking...";
    } else if (status === ChatRequestStatus.NAV_AGENT_REVIEW) {
        return "Navigation agent reviewing...";
    } else if (status === ChatRequestStatus.NAV_AGENT_THINKING) {
        return "Navigation agent thinking...";
    } else if (status === ChatRequestStatus.RHETO_AGENT_REVIEW) {
        return "Rhetorician agent reviewing...";
    } else if (status === ChatRequestStatus.RHETO_AGENT_THINKING) {
        return "Rhetorician agent thinking...";
    } else {
        return undefined;
    }
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