"use client"

import clsx from "clsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter, faDownLeftAndUpRightToCenter } from "@fortawesome/free-solid-svg-icons";

import "@/app/ui/queue/cuisine-item/cuisine-item.css";
import { CuisineItemProps } from "@/app/ui/queue/cuisine-item/cuisine-item.definition";
import React from "react";

export function CuisineItem(props: CuisineItemProps) {
    const [collapse, setCollapse] = React.useState(true);

    const toggleCollapse = () => {
        setCollapse(!collapse);
    }

    return (<>
        <div className="cart-item">
            <p>
                {props.index}. {props.cuisineName} ({props.quantity})
                <FontAwesomeIcon
                    icon={collapse ? faDownLeftAndUpRightToCenter : faUpRightAndDownLeftFromCenter}
                    size="sm"
                    className="collapse-icon"
                    onClick={toggleCollapse}/>
            </p>
            {props.options.map(item => {
                return (
                    <p className={clsx("cuisine-option ", {"hide": collapse})} key={item}>{item}</p>
                );
            })}
        </div>
    </>)
}