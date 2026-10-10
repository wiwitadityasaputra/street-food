import { writeToUserChatMain } from "@/src/lib/database/database";
import { ChatRequestStatus, ChatStreamResponse } from "@/src/lib/route/chat/v1/chat.definition";
import { describeTaksResponse } from "@/src/lib/route/chat/v1/responses";

export const DescribeTasksAgent = async (userId: string, send: (data: ChatStreamResponse) => void): Promise<void> => {
    const responses: string[] = describeTaksResponse();
    for (const r of responses) {
        await writeToUserChatMain(userId, "assistant", "standard", r);
    }

    const data =  {
        status: ChatRequestStatus.DONE,
        replies: responses
    };
    send(data);
}