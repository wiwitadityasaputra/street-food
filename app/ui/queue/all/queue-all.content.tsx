import { QueueMenu } from "@/app/ui/queue/queue-menu/queue-menu";
import { QueueAllContentProps } from "@/app/ui/queue/all/queue-all.definition";

export function QueueAllContent(props: QueueAllContentProps) {
    return (<>

        <div className="queue-all">
            <QueueMenu userTotalOrder={props.userTotalOrder}/>
            all
        </div>
    </>)
}