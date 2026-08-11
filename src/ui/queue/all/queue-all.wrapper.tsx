"use server";

import { redirect } from "next/navigation";

import { QueueAllContent } from "@/src/ui/queue/all/queue-all.content";
import { fetchAllOrdersPage } from "@/src/lib/service/queue.service";
import { AllUserOrder } from "@/src/lib/service/service.definition";
import { QueueAllWrapperProps } from "@/src/ui/queue/all/queue-all.definition";

export async function QueueAllWrapper(props: QueueAllWrapperProps) {
    const orders = await fetchAllOrdersPage(props.page);
    if (orders.length === 0) {
        redirect(`/queue/all?page=1`);
    }

    const compare = (a: AllUserOrder, b: AllUserOrder) => {
        return b.orderId - a.orderId;
    };
    orders.sort(compare);

    return (<>
        <QueueAllContent orders={orders} />
    </>);
}