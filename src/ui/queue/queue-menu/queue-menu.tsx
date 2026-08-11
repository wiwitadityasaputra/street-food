"use client";

import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDoubleLeft,
    faAngleDoubleRight,
    faAngleLeft,
    faAngleRight
} from "@fortawesome/free-solid-svg-icons";

import "@/src/ui/queue/queue-menu/queue-menu.css";
import { QueueMenuProps } from "@/src/ui/queue/queue-menu/queue-menu.definition";

const MENU_ME_HREF = "/queue/me";
const MENU = [
    {
        name: "My Orders",
        href: MENU_ME_HREF,
        className: "my-button"
    }, {
        name: "All Orders",
        href: "/queue/all",
        className: "all-button"
    }
];

export function QueueMenu(props: QueueMenuProps) {
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()

    const changeMenu = (newPath: string) => {
        replace(newPath)
    }

    // page will always positif number
    //  src/app/queue/all/page.tsx
    const page = Number(searchParams.get("page"));

    const showPagination = props.maxPage && page;
    const prevPagButtonDisabled = page === 1;
    const nextPagButtunDisabled = !!(props.maxPage && page === props.maxPage);

    const firstPage = () => {
        replace(`/queue/all?page=1`);
    }
    const prevPage = () => {
        replace(`/queue/all?page=${page - 1}`);
    }
    const nextPage = () => {
        replace(`/queue/all?page=${page + 1}`);
    }
    const lastPage = () => {
        replace(`/queue/all?page=${props.maxPage}`);
    }

    return (<>
        <div className="queue-menu">
            <div className="container">
                <div className="menu_filter">
                    {MENU.map(m => {
                        if (props.userTotalOrder === 0 && m.href === MENU_ME_HREF) {
                            return;
                        }
                        return (<button key={m.href}
                            className={clsx(m.className, {"active": pathname === m.href})}
                            onClick={() => changeMenu(m.href)}>
                            {m.name}
                        </button>)
                    })}
                    <div className={clsx("pagination", {"hide": !showPagination})}>
                        <button className="active"
                            disabled={prevPagButtonDisabled}
                            onClick={firstPage}>
                            <FontAwesomeIcon icon={faAngleDoubleLeft} size="sm"/>
                        </button>
                        <button className="active"
                            disabled={prevPagButtonDisabled}
                            onClick={prevPage}>
                            <FontAwesomeIcon icon={faAngleLeft} size="sm"/>
                        </button>
                        <span className="current-page">{page}</span>
                        <button className="active"
                            disabled={nextPagButtunDisabled}
                            onClick={nextPage}>
                            <FontAwesomeIcon icon={faAngleRight} size="sm"/>
                        </button>
                        <button className="active"
                            disabled={nextPagButtunDisabled}
                            onClick={lastPage}>
                            <FontAwesomeIcon icon={faAngleDoubleRight} size="sm"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}