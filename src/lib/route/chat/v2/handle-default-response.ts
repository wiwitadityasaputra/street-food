import { writeToUserChatMain } from "@/src/lib/database/database";
import { ChatRequestStatus, ChatStreamResponse } from "../v1/chat.definition";
import { badQuestionResponse, welcomeResponse } from "../v1/responses";

export const handleDefaultResponse = async (userId: string): Promise<ChatStreamResponse> => {
    const badQuestResponse = badQuestionResponse();
    writeToUserChatMain(userId, "standard", "assistant", badQuestResponse);

    const responseMsg = welcomeResponse();
    writeToUserChatMain(userId, "standard", "assistant", responseMsg);

    return {
        status: ChatRequestStatus.DONE,
        replies: [badQuestResponse, responseMsg]
    };
}