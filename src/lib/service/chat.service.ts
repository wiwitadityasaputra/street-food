import { fetchChatHistories } from "@/src/lib/database/database";
import { UserChatMainFe } from "@/src/lib/database/database.definition";

export async function getChatHistories(userId: string): Promise<UserChatMainFe[]> {
    return await fetchChatHistories(userId);
}