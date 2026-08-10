"use server";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { QueueAllContent } from "@/src/ui/queue/all/queue-all.content";
import { countUserOrders } from "@/src/lib/database/database";
import { fetchAllOrders } from "@/src/lib/service/queue.service";
import { AllUserOrder } from "@/src/lib/service/service.definition";

export async function QueueAllWrapper() {
    const userId = await cookiesGetUserId();
    const totalOrders = await countUserOrders(userId);
    const orders = await fetchAllOrders();
    const compare = (a: AllUserOrder, b: AllUserOrder) => {
        return b.orderId - a.orderId;
    };
    orders.sort(compare);

    return (<>
        <QueueAllContent userTotalOrder={totalOrders} orders={orders} />
    </>);
}