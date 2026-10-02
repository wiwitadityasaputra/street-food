import { Suspense } from "react";

import { CartSkeleton } from "@/src/ui/cart/cart-skeleton";
import { CartWrapper } from "@/src/ui/cart/cart-wrapper";
import { cookiesGet } from "@/src/lib/util/cookie-util";
import { getChatHistories } from "@/src/lib/service/chat.service";
import { UserChatMainFe } from "@/src/lib/database/database.definition";

export default async function Cart() {
    const cookieData = await cookiesGet();
    const messages: UserChatMainFe[] = await getChatHistories(cookieData.userId)

    return (<>
        <Suspense fallback={<CartSkeleton />}>
            <CartWrapper messages={messages}/>
        </Suspense>
    </>);
}