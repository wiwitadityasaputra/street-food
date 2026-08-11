"use client"

import React from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUpRightAndDownLeftFromCenter,
    faDownLeftAndUpRightToCenter
} from "@fortawesome/free-solid-svg-icons";

import "@/src/ui/queue/order-status/order-status.css";
import { formatDate, orderFlagToStatus } from "@/src/lib/util/utils";
import { OrderStatusProps } from "@/src/ui/queue/order-status/order-status.definition";


export function OrderStatus(props: OrderStatusProps) {
    const [collapse, setCollapse] = React.useState(true);

    const toggleCollapse = () => {
        setCollapse(!collapse);
    }

    const mustShow = (flagIndex: number) => {
        return collapse && !(Number(props.flagOrder) === flagIndex);
    }

    return (<>
        <h5 className="order-status">
            {orderFlagToStatus(props.flagOrder)}
            <FontAwesomeIcon
                icon={collapse ? faDownLeftAndUpRightToCenter : faUpRightAndDownLeftFromCenter}
                size="sm"
                className="collapse-icon"
                onClick={toggleCollapse} />
        </h5>

        <div className="row order-status-date">
            <div className={clsx("col-lg-6", {"hide": mustShow(1)})}>
                <h6>Created Date</h6>
                <p className="date-value">{formatDate(props.createdDate)}</p>
            </div>
            <div className={clsx("col-lg-6", {"hide": mustShow(2)})}>
                <h6>Cooking Date</h6>
                <p className="date-value">{formatDate(props.cookedDate)}</p>
            </div>
            <div className={clsx("col-lg-6", {"hide": mustShow(3)})}>
                <h6>Shipped Date</h6>
                <p className="date-value">{formatDate(props.shippedDate)}</p>
            </div>
            <div className={clsx("col-lg-6", {"hide": mustShow(4)})}>
                <h6>Delivered Date</h6>
                <p className="date-value">{formatDate(props.deliveredDate)}</p>
            </div>
            <div className={clsx("col-lg-6", {"hide": mustShow(5)})}>
                <h6>Cancelled Date</h6>
                <p className="date-value">{formatDate(props.cancelledDate)}</p>
            </div>
        </div>
    </>);
}