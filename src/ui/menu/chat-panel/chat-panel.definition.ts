import { UserChatMainFe } from "@/src/lib/database/database.definition";

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export interface ChatPanelProps {
    messages: UserChatMainFe[];
}