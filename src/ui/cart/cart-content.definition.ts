import { UserCartResponse } from "@/src/lib/service/service.definition";
import { UserChatMainFe } from "@/src/lib/database/database.definition";

export interface CartWrapperProps {
    messages: UserChatMainFe[];
}

export interface CartContentProps {
    carts: UserCartResponse[];
    userId: string;
    messages: UserChatMainFe[];
}