"use server";

import { cookiesGetUserId } from "@/app/lib/util/cookie-util";
import { QueueAllContent } from "./queue-all.content";
import { countUserOrders } from "@/app/lib/database/database";

export async function QueueAllWrapper() {
    const userId = await cookiesGetUserId();
    const totalOrders = await countUserOrders(userId);
    
    return (<>
        <QueueAllContent userTotalOrder={totalOrders} />
    </>);
}