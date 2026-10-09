import { writeToUserChatMain } from "@/src/lib/database/database";
import { ChatRequestStatus, ChatStreamResponse } from "@/src/lib/route/chat/v1/chat.definition";
import { badQuestionResponse, welcomeResponse } from "@/src/lib/route/chat/v1/responses";

export const handleDefaultResponse = async (userId: string): Promise<ChatStreamResponse> => {
    const badQuestResponse = badQuestionResponse();
    await writeToUserChatMain(userId, "standard", "assistant", badQuestResponse);

    const responseMsg = welcomeResponse();
    await writeToUserChatMain(userId, "standard", "assistant", responseMsg);

    return {
        status: ChatRequestStatus.DONE,
        replies: [badQuestResponse, responseMsg]
    };
}