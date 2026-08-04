"use client";

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import clsx from "clsx";
import React from "react";

const menus = [
    {
        name: "all"
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

export default function FoodMenu() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    let [activeMenu, setActiveMenu] = React.useState("all");

    const initMenu = searchParams.get("menu");
    if (!initMenu) {
        setMenu(activeMenu);
    }

    function setMenu(menu: string) {
        const params = new URLSearchParams(searchParams);
        params.set("menu", menu);
        replace(`${pathname}?${params.toString()}`);
    }

    function menuClicked(selectedMenu: string) {
        setActiveMenu(selectedMenu);
        setMenu(selectedMenu);
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
                        menus.map((menu) => {
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