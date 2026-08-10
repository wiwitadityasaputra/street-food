"use server";

import { redirect } from "next/navigation";

import "@/app/ui/queue/queue.css";

import { countUserOrders, fetchUserOrders } from "@/app/lib/service/queue.service";
import { cookiesGetUserId } from "@/app/lib/util/cookie-util";
import { QueueContent } from "@/app/ui/queue/queue.content";
import { UserOrder } from "@/app/lib/service/service.definition";

export async function QueueWrapper() {
    const userId = await cookiesGetUserId();
    const totalOrders = await countUserOrders(userId);

    if (totalOrders === 0) {
        redirect(`/queue/all`);
    }

    const userOrders: UserOrder[] = await fetchUserOrders(userId);
    const compare = (a: UserOrder, b: UserOrder) => {
        return b.orderId - a.orderId;
    };
    const sortedOrders = userOrders.sort(compare)

    return (<>
        <QueueContent userOrders={userOrders}/>
    </>);
}