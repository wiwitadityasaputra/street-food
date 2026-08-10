import { QueueAllSkeleton } from "@/app/ui/queue/all/queue-all.skeleton";
import { QueueAllWrapper } from "@/app/ui/queue/all/queue-all.wrapper";
import { Suspense } from "react";

export default function QueueAll() {
    return (<>
        <Suspense fallback={<QueueAllSkeleton />}>
            <QueueAllWrapper />
        </Suspense>
    </>);
}