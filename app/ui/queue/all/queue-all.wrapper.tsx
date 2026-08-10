"use server";

import { cookiesGetUserId } from "@/app/lib/util/cookie-util";
import { QueueAllContent } from "@/app/ui/queue/all/queue-all.content";
import { countUserOrders } from "@/app/lib/database/database";
import { fetchAllOrders } from "@/app/lib/service/queue.service";
import { AllUserOrder } from "@/app/lib/service/service.definition";

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