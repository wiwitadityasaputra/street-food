"use client";

import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";

import "@/app/ui/queue/queue-menu/queue-menu.css";
import { QueueMenuProps } from "@/app/ui/queue/queue-menu/queue-menu.definition";

const MENU_ME_HREF = "/queue/me";
const MENU = [
    {
        name: "My Orders",
        href: MENU_ME_HREF
    }, {
        name: "All Orders",
        href: "/queue/all"
    }
]

export function QueueMenu(props: QueueMenuProps) {
    const { replace } = useRouter();
    const pathname = usePathname();

    const changeMenu = (newPath: string) => {
        replace(newPath)
    }

    return (<>
        <section className="cart_view">
            <div className="queue-menu">
                <div className="container">
                    <div className="menu_filter">
                        {MENU.map(m => {
                            if (props.userTotalOrder === 0 && m.href === MENU_ME_HREF) {
                                return;
                            }
                            return (<button key={m.href}
                                className={clsx({"active": pathname === m.href})}
                                onClick={() => changeMenu(m.href)}>
                                {m.name}
                            </button>)
                        })}
                    </div>
                </div>
            </div>
        </section>
    </>);
}