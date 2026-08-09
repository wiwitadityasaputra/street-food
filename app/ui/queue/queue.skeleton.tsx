"use server";

import "@/app/ui/queue/queue.css";

export async function QueueSkeleton() {
    return (<>
        <div className="queue">please wait,,,</div>
    </>)
}