import { Suspense } from "react";

import { QueueAllSkeleton } from "@/src/ui/queue/all/queue-all.skeleton";
import { QueueAllWrapper } from "@/src/ui/queue/all/queue-all.wrapper";

export default function QueueAll() {
    return (<>
        <Suspense fallback={<QueueAllSkeleton />}>
            <QueueAllWrapper />
        </Suspense>
    </>);
}