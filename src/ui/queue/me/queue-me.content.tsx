"use client";

import clsx from "clsx";

import "@/src/ui/queue/me/queue-me.css";

import { formatDate, orderFlagToStatus } from "@/src/lib/util/utils";
import { QueueMeContentProps } from "@/src/ui/queue/me/queue-me.definition";

export function QueueMeContent(props: QueueMeContentProps) {

    return (<>
        <div className="queue">
            <section className="cart_view mt_100 xs_mt_70 mb_100 xs_mb_70 queue-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 wow fadeInUp">
                            <div className="cart_list">
                                <div className="table-responsive">
                                    <table className="order-table">
                                        <tbody>
                                            <tr>
                                                <th className="pro_name">Address</th>
                                                <th className="pro_name col-cart-item">Items</th>
                                                <th className="pro_img col-cart-date">Status</th>
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
                                                                    {index + 1}. {i.cuisineName} ({i.quantity})
                                                                </p>
                                                                {i.options.map(item => {
                                                                    return (<p className="cuisine-option" key={item}>{item}</p>);
                                                                })}
                                                            </div>)  
                                                        })}
                                                    </td>
                                                    <td className="pro_img col-cart-date">
                                                        <h5 className="order-status">{orderFlagToStatus(o.flagOrder)}</h5>

                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <h6>Created Date</h6>
                                                                <p className="date-value">{formatDate(o.createdDate)}</p>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <h6>Cooking Date</h6>
                                                                <p className="date-value">{formatDate(o.cookedDate)}</p>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <h6>Shipped Date</h6>
                                                                <p className="date-value">{formatDate(o.shippedDate)}</p>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <h6>Delivered Date</h6>
                                                                <p className="date-value">{formatDate(o.deliveredDate)}</p>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <h6>Cancelled Date</h6>
                                                                <p className="date-value">{formatDate(o.cancelledDate)}</p>
                                                            </div>
                                                        </div>
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