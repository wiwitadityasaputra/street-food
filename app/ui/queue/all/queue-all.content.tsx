import { QueueMenu } from "../queue-menu/queue-menu";
import { QueueAllContentProps } from "./queue-all.definition";

export function QueueAllContent(props: QueueAllContentProps) {
    return (<>

        <div className="queue-all">
            <QueueMenu userTotalOrder={props.userTotalOrder}/>
            all
        </div>
    </>)
}