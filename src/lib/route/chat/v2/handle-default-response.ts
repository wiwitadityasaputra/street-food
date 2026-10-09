import { ChatRequestStatus, ChatStreamResponse } from "../v1/chat.definition";
import { badQuestionResponse, welcomeResponse } from "../v1/responses";

export const handleDefaultResponse = async (userId: string): Promise<ChatStreamResponse> => {
    const badQuestResponse = badQuestionResponse();
    const responseMsg = welcomeResponse();

    return {
        status: ChatRequestStatus.DONE,
        replies: [badQuestResponse, responseMsg]
    };
}