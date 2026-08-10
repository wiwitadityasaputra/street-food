"use client";

import { useRouter, usePathname } from "next/navigation";
import "@/app/ui/queue/queue-menu/queue-menu.css";
import clsx from "clsx";

const MENU = [
    {
        name: "My Orders",
        href: "/queue/me"
    }, {
        name: "All Orders",
        href: "/queue/all"
    }
]

export function QueueMenu() {
    const { replace } = useRouter();
    const pathname = usePathname();

    const changeMenu = (newPath: string) => {
        replace(newPath)
    }

    return (<>
        <div className="queue-menu">
            <div className="menu_filter">
                {MENU.map(m => {
                    return (<button key={m.href}
                        className={clsx({"active": pathname === m.href})}
                        onClick={() => changeMenu(m.href)}>
                        {m.name}
                    </button>)
                })}
            </div>
        </div>
    </>);
}