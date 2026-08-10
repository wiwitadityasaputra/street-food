"use server";

import { redirect } from "next/navigation";

import "@/app/ui/queue/me/queue-me.css";

import { countUserOrders, fetchUserOrders } from "@/app/lib/service/queue.service";
import { cookiesGetUserId } from "@/app/lib/util/cookie-util";
import { QueueMeContent } from "@/app/ui/queue/me/queue-me.content";
import { UserOrder } from "@/app/lib/service/service.definition";

export async function QueueMeWrapper() {
    const userId = await cookiesGetUserId();
    const totalOrders = await countUserOrders(userId);

    if (totalOrders === 0) {
        redirect(`/queue/all`);
    }

    const userOrders: UserOrder[] = await fetchUserOrders(userId);
    const compare = (a: UserOrder, b: UserOrder) => {
        return b.orderId - a.orderId;
    };
    userOrders.sort(compare)

    return (<>
        <QueueMeContent userOrders={userOrders}/>
    </>);
}