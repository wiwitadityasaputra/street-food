"use server";

import { QueueAllContent } from "./queue-all.content";

export async function QueueAllWrapper() {
    return (<>
        <QueueAllContent />
    </>);
}