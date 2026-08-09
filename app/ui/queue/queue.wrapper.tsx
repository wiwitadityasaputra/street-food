"use server";

import "@/app/ui/queue/queue.css";
import { QueueContent } from "./queue.content";

export async function QueueWrapper() {
    return (<>
        <QueueContent />
    </>);
}