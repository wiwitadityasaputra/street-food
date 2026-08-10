import { Suspense } from "react";

import { QueueMeSkeleton } from "@/src/ui/queue/me/queue-me.skeleton";
import { QueueMeWrapper } from "@/src/ui/queue/me/queue-me.wrapper";

export default function QueueMe() {
    return (<>
        <Suspense fallback={<QueueMeSkeleton />}>
            <QueueMeWrapper />
        </Suspense>
    </>);
}