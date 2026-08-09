import { Suspense } from "react";

import "@/app/queue/queue.css";
import { QueueSkeleton } from "@/app/ui/queue/queue.skeleton";
import { QueueWrapper } from "@/app/ui/queue/queue.wrapper";

export default function QueueMe() {
    return (<>
        <Suspense fallback={<QueueSkeleton />}>
            <QueueWrapper />
        </Suspense>
    </>);
}