"use server";

import { redirect } from "next/navigation";

import "@/src/ui/queue/me/queue-me.css";

import { countUserOrders, fetchUserOrders } from "@/src/lib/service/queue.service";
import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { QueueMeContent } from "@/src/ui/queue/me/queue-me.content";
import { MyUserOrder } from "@/src/lib/service/service.definition";

export async function QueueMeWrapper() {
    const userId = await cookiesGetUserId();
    const totalOrders = await countUserOrders(userId);

    if (totalOrders === 0) {
        redirect(`/queue/all?page=1&size=5`);
    }

    const userOrders: MyUserOrder[] = await fetchUserOrders(userId);
    const compare = (a: MyUserOrder, b: MyUserOrder) => {
        return b.orderId - a.orderId;
    };
    userOrders.sort(compare)

    return (<>
        <QueueMeContent userOrders={userOrders}/>
    </>);
}