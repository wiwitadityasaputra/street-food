import { Suspense } from "react";

import { QueueAllSkeleton } from "@/app/ui/queue/all/queue-all.skeleton";
import { QueueAllWrapper } from "@/app/ui/queue/all/queue-all.wrapper";

export default function QueueAll() {
    return (<>
        <Suspense fallback={<QueueAllSkeleton />}>
            <QueueAllWrapper />
        </Suspense>
    </>);
}