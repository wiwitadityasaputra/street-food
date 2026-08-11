"use server";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { QueueAllContent } from "@/src/ui/queue/all/queue-all.content";
import { countUserOrders } from "@/src/lib/database/database";
import { countAllOrdersPage, fetchAllOrdersPage } from "@/src/lib/service/queue.service";
import { AllUserOrder } from "@/src/lib/service/service.definition";
import { NUMBER_PER_PAGE, QueueAllWrapperProps } from "@/src/ui/queue/all/queue-all.definition";

export async function QueueAllWrapper(props: QueueAllWrapperProps) {
    const userId = await cookiesGetUserId();
    const userTotalOrder = await countUserOrders(userId);

    const totalAllOrders = await countAllOrdersPage();
    const maxPage = Math.ceil(totalAllOrders / NUMBER_PER_PAGE);

    const orders = await fetchAllOrdersPage(props.page);
    const compare = (a: AllUserOrder, b: AllUserOrder) => {
        return b.orderId - a.orderId;
    };
    orders.sort(compare);

    return (<>
        <QueueAllContent
            userTotalOrder={userTotalOrder}
            orders={orders}

            page={props.page}
            maxPage={maxPage}
        />
    </>);
}