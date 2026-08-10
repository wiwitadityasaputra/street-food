import { QueueMenu } from "@/app/ui/queue/queue-menu/queue-menu";
import { QueueAllContentProps } from "@/app/ui/queue/all/queue-all.definition";
import { CuisineItem } from "../cuisine-item/cuisine-item";
import { OrderStatus } from "../order-status/order-status";

export function QueueAllContent(props: QueueAllContentProps) {
    return (<>
        <div className="queue-all">
            <QueueMenu userTotalOrder={props.userTotalOrder}/>
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
                                            {props.orders.map(o => {
                                                return (<tr key={o.orderId} className="order-row">
                                                    <td className="pro_name col-cart-name">
                                                        <h5 className="user-name">
                                                            {o.orderId}. {o.firstName} {o.lastName}
                                                        </h5>
                                                        <h6 className="user-address">Street Address</h6>
                                                        <p>{o.streetAddress}</p>
                                                    </td>
                                                    <td className="pro_name col-cart-item">
                                                        {o.items.map((i, index) => {
                                                            return (<CuisineItem
                                                                key={i.cartId}
                                                                index={index + 1}
                                                                cuisineName={i.cuisineName}
                                                                quantity={i.quantity}
                                                                options={i.options}
                                                            />)
                                                        })}
                                                    </td>
                                                    <td className="pro_img col-cart-date">
                                                        <OrderStatus 
                                                            flagOrder={o.flagOrder}
                                                            createdDate={o.createdDate}
                                                            cookedDate={o.cookedDate}
                                                            shippedDate={o.shippedDate}
                                                            deliveredDate={o.deliveredDate}
                                                            cancelledDate={o.cancelledDate}
                                                        />
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