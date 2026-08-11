"use client";

import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";

import "@/src/ui/queue/queue-menu/queue-menu.css";
import { QueueMenuProps } from "@/src/ui/queue/queue-menu/queue-menu.definition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const MENU_ME_HREF = "/queue/me";
const MENU = [
    {
        name: "My Orders",
        href: MENU_ME_HREF
    }, {
        name: "All Orders",
        href: "/queue/all"
    }
];

export function QueueMenu(props: QueueMenuProps) {
    const { replace } = useRouter();
    const pathname = usePathname();

    const changeMenu = (newPath: string) => {
        replace(newPath)
    }

    const showPagination = props.maxPage && props.page;
    const prevPagButtonDisabled = props.page === 1;
    const nextPagButtunDisabled = !!(props.page && props.maxPage && props.page === props.maxPage);

    const prevPage = () => {
        const page = Number(props.page) - 1;
        replace(`/queue/all?page=${page}`)        
    }
    const nextPage = () => {
        const page = Number(props.page) + 1;
        replace(`/queue/all?page=${page}`)
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
                        <div className={clsx("pagination", {"hide": !showPagination})}>
                            <button className="active"
                                disabled={prevPagButtonDisabled}
                                onClick={prevPage}>
                                <FontAwesomeIcon icon={faArrowLeft} size="sm"/>
                            </button>
                            <span className="current-page">{props.page}</span>
                            <button className="active"
                                disabled={nextPagButtunDisabled}
                                onClick={nextPage}>
                                <FontAwesomeIcon icon={faArrowRight} size="sm"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>);
}