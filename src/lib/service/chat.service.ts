import { fetchChatHistories } from "@/src/lib/database/database";
import { UserChatMainFe } from "@/src/lib/database/database.definition";

export async function getChatHistories(userId: string): Promise<UserChatMainFe[]> {
    const resultFe: UserChatMainFe[] = [];
    const resultsDb =  await fetchChatHistories(userId);
    resultsDb.forEach(d => resultFe.push({
        message: d.user_input,
        role: d.role
    }));
    return resultFe
}