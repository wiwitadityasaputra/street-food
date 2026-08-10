import { usePathname } from "next/navigation";

import "@/app/ui/queue/queue-menu/queue-menu.css";

export function QueueMenu() {
    const pathname = usePathname();
    console.log("dbg pathName ", pathname)
    return (<>
        <div className="queue-menu">
            <div className="menu_filter">
                <button className="active">My Orders</button>
                <button>All Orders</button>
            </div>
        </div>
    </>);
}