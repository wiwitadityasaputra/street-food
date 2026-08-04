"use client";

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import clsx from "clsx";
import React from "react";

export const DEFAULT_CUISINE = "all";
const cuisines = [
    {
        name: DEFAULT_CUISINE
    }, {
        name: "indonesian"
    }, {
        name: "western"
    }, {
        name: "korean"
    }, {
        name: "chinese"
    }, 
];

export default function Cuisines() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    let [activeMenu, setActiveMenu] = React.useState("all");

    const initMenu = searchParams.get("cuisine");
    if (initMenu) {
        activeMenu = initMenu;
    }

    function changeMenu(menu: string) {
        const params = new URLSearchParams(searchParams);
        params.set("cuisine", menu);
        replace(`${pathname}?${params.toString()}`);
    }

    function menuClicked(selectedMenu: string) {
        setActiveMenu(selectedMenu);
        changeMenu(selectedMenu);
    }

    return (
        <div className="row">
            <div className="col-xl-6 col-lg-6 wow fadeInUp" data-wow-duration="1s">
                <div className="section_heading mb_25">
                    <h4>food Menu</h4>
                    <h2>Popular Delicious Foods</h2>
                </div>
            </div>
            <div className="col-xl-6 col-lg-6 wow fadeInUp" data-wow-duration="1s">
                <div className="menu_filter d-flex flex-wrap">
                    {
                        cuisines.map((menu) => {
                            return (
                                <button key={menu.name} className={clsx({"active": menu.name === activeMenu})}
                                    onClick={() => menuClicked(menu.name)}>
                                    {menu.name}
                                </button>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}