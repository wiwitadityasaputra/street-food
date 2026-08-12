"use client";

import { ChangeEvent } from "react";
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
import {
    MENU,
    MENU_ME_HREF,
    QueueMenuProps
} from "@/src/ui/queue/queue-menu/queue-menu.definition";

export function QueueMenu(props: QueueMenuProps) {
    const { replace } = useRouter();
    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams()

    const changeMenu = (newPath: string) => {
        replace(newPath)
    }

    // page will always positif number
    // size will always valid
    //  src/app/queue/all/page.tsx
    const page = Number(searchParams.get("page"));
    const size = Number(searchParams.get("size"));
    const maxPage = Math.ceil(props.totalOrders / size);

    const showPagination = maxPage && page;
    const prevPagButtonDisabled = page === 1;
    const nextPagButtunDisabled = !!(page === maxPage);

    const firstPage = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    }
    const prevPage = () => {
        const newPage = page - 1;
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    }
    const nextPage = () => {
        const newPage = page + 1;
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    }
    const lastPage = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(maxPage));
        router.push(`${pathname}?${params.toString()}`);
    }

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const size = e.target.value

        const params = new URLSearchParams(searchParams.toString());
        params.set('size', size);
        router.push(`${pathname}?${params.toString()}`);
    }

    return (<>
        <div className="queue-menu-pre"/>
        <div className="queue-menu">
            <div className="container">
                <div className="menu_filter">
                    <div className="queue-btns">
                        {MENU.map(m => {
                            if (props.userTotalOrder === 0 && m.href === MENU_ME_HREF) {
                                return;
                            }
                            return (
                                <button key={m.key}
                                    className={clsx(m.className, {"active": pathname === m.href})}
                                    onClick={() => changeMenu(m.href)}>
                                    <span className="wide-screen">{m.name}</span>
                                    <span className="small-screen">{m.nameShort}</span>
                                </button>
                            )
                        })}
                    </div>
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
                        <div className="menu_search">
                            <div className="select_area">
                                <span className="dropdown-info">Items: </span>
                                    <select className="select_js dropdown-values"
                                        name="items"
                                        value={size}
                                        onChange={handleChange}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="25">25</option>
                                    </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}