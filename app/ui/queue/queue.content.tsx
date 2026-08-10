"use client";

import "@/app/ui/queue/queue.css";
import { QueueContentProps } from "./queue.definition";
import clsx from "clsx";
import { OrderDbFlag } from "@/app/lib/database/database.definition";
import { formatDate } from "@/app/lib/util/utils";

export function QueueContent(props: QueueContentProps) {

    const orderFlagToStatus = (flag: number) => {
        const flagN = Number(flag);
        if (flagN === OrderDbFlag.CREATED) {
            return "Order placed";
        } else if (flagN === OrderDbFlag.COOKED) {
            return "Cooked";
        } else if (flagN === OrderDbFlag.SHIPPED) {
            return "Shipped";
        } else if (flagN === OrderDbFlag.RECEIVED) {
            return "Received";
        } else if (flagN === OrderDbFlag.CANCELLED) {
            return "Cancelled";
        }
        return "-";
    }

    return (<>
        <div className="queue">
            <section className="cart_view mt_100 xs_mt_70 mb_100 xs_mb_70">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 wow fadeInUp">
                            <div className="cart_list">
                                <div className="table-responsive">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th className="pro_name">Address</th>
                                                <th className="pro_name col-cart-item">Items</th>
                                                <th className="pro_img">Status</th>
                                                <th className="pro_img col-cart-date">Date</th>
                                            </tr>
                                            {props.userOrders.map(o => {
                                                return (<tr key={o.orderId} className="order-row">
                                                    <td className="pro_name col-cart-name">
                                                        <h5 className="user-name">
                                                            {o.orderId}. {o.firstName} {o.lastName}
                                                        </h5>

                                                        <h6 className="user-address">Street Address</h6>
                                                        <p>{o.streetAddress} - {o.secondAddress}</p>
                                                        <p>{o.additionalInfo}</p>

                                                        <h6 className="user-address">Regency</h6>
                                                        <p>{o.state} - {o.city} - {o.zipCode}</p>

                                                        <h6 className="user-address">Contact Person</h6>
                                                        <p>{o.emailAddress} - {o.phoneNumber}</p>
                                                    </td>
                                                    <td className="pro_name col-cart-item">
                                                        {o.items.map((i, index) => {
                                                            return (<div key={i.cartId} className="cart-item">
                                                                <p className={clsx("cuisine-name ", {"not-first": index > 0})}>
                                                                    {index + 1}. {i.cuisineName}
                                                                </p>
                                                                {i.options.map(item => {
                                                                    return (<p className="cuisine-option" key={item}>{item}</p>);
                                                                })}
                                                            </div>)  
                                                        })}
                                                        <div>

                                                        </div>
                                                    </td>
                                                    <td className="pro_img col-cart-status">
                                                        {orderFlagToStatus(o.flagOrder)}
                                                    </td>
                                                    <td className="pro_img col-cart-date">
                                                        <h6>Order Created Date</h6>
                                                        <p>{formatDate(o.createdDate)}</p>

                                                        <h6 className="not-first">Cooking Date</h6>
                                                        <p>{formatDate(o.cookedDate)}</p>

                                                        <h6 className="not-first">Shipped Date</h6>
                                                        <p>{formatDate(o.shippedDate)}</p>

                                                        <h6 className="not-first">Delivered Date</h6>
                                                        <p>{formatDate(o.deliveredDate)}</p>

                                                        <h6 className="not-first">Cancelled Date</h6>
                                                        <p>{formatDate(o.cancelledDate)}</p>
                                                    </td>
                                                </tr>)
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>)
}