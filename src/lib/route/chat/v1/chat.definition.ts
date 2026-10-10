export enum ChatRequestStatus {
    REVIEW = 1,
    THINKING = 2,
    DONE = 3,
    CS_AGENT_REVIEW = 4,
    CS_AGENT_THINKING = 5,
    NAV_AGENT_REVIEW = 6,
    NAV_AGENT_THINKING = 7,
    RHETO_AGENT_REVIEW = 8,
    RHETO_AGENT_THINKING = 9,
    CA_AGENT_REVIEW = 10,
    CA_AGENT_THINKING = 11,
    WAITERS_AGENT_THINKING = 12
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
    } else if (status === ChatRequestStatus.CA_AGENT_REVIEW) {
        return "Culinary adisor reviewing...";
    } else if (status === ChatRequestStatus.CA_AGENT_THINKING) {
        return "Culinary adisor thinking...";
    } else if (status === ChatRequestStatus.WAITERS_AGENT_THINKING) {
        return "Waiters agent thinking...";
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
    status?: ChatRequestStatus;
    action?: string;
    replies?: string[];
    totalCart?: number;
    option?: ChatStreamOption;
    v1Flow?: V1Flow;
}

export enum V1Flow {
    USER_TO_CS = "user-to-cs",
    CS_TO_GEMINI = "cs-to-gemini",
    GEMINI_TO_CS = "gemini-to-cs",
    CS_TO_LLM = "cs-to-llm",
    LLM_TO_CS = "llm-to-cs",
    CS_TO_CART_EDIT = "cs-to-cart-edit",
    CS_TO_CART_ADD = "cs-to-cart-add",
    CS_TO_CART_DELETE = "cs-to-cart-delete",
    CS_TO_PAGE_NAV = "cs-to-page-nav",
    CS_TO_AQ = "cs-to-default-response",
    CS_TO_FOOD_SUGGEST = "cs-to-food-suggest",
    CS_TO_DESCRIBE_TASK = "cs-to-describe-task",
    CS_TO_DEFAULT_RESPONSE = "cs-to-aq"
}