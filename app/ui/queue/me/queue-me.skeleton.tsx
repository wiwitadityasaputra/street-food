"use server";

import "@/app/ui/queue/me/queue-me.css";

export async function QueueMeSkeleton() {
    return (<>
        <div className="queue">please wait,,,</div>
    </>)
}