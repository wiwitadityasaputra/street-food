import { QueueAllContentProps } from "@/src/ui/queue/all/queue-all.definition";
import { CuisineItem } from "@/src/ui/queue/cuisine-item/cuisine-item";
import { OrderStatus } from "@/src/ui/queue/order-status/order-status";
import { UserInfo } from "../user-info/user-info";

export function QueueAllContent(props: QueueAllContentProps) {
    return (<>
        <div className="queue-all">
            <section className="cart_view mt_100 xs_mt_70 mb_100 xs_mb_70 queue-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 wow fadeInUp">
                            <div className="cart_list">
                                <div className="table-responsive">
                                    <table className="order-table">
                                        <tbody>
                                            <tr>
                                                <th className="pro_name col-cart-name">
                                                    <span className="wide-screen">Address</span>
                                                    <span className="small-screen">Orders</span>
                                                </th>
                                                <th className="pro_name col-cart-item">Items</th>
                                                <th className="pro_img col-cart-date">Status</th>
                                            </tr>
                                            {props.orders.map(o => {
                                                return (<tr key={o.orderId} className="order-row">
                                                    <td className="pro_name col-cart-name">
                                                        <span className="wide-screen">
                                                            <UserInfo
                                                                orderId={o.orderId}
                                                                firstName={o.firstName}
                                                                lastName={o.lastName}
                                                                streetAddress={o.streetAddress}
                                                            />
                                                        </span>

                                                        <div className="row">
                                                            <div className="col-6 u-info">
                                                                <UserInfo
                                                                    orderId={o.orderId}
                                                                    firstName={o.firstName}
                                                                    lastName={o.lastName}
                                                                    streetAddress={o.streetAddress}
                                                                />
                                                            </div>
                                                            <div className="col-6 order-status-small-screen">
                                                                <OrderStatus 
                                                                    flagOrder={o.flagOrder}
                                                                    createdDate={o.createdDate}
                                                                    cookedDate={o.cookedDate}
                                                                    shippedDate={o.shippedDate}
                                                                    deliveredDate={o.deliveredDate}
                                                                    cancelledDate={o.cancelledDate}
                                                                />
                                                            </div>
                                                            <div className="col-6 cuisine-item">
                                                                {o.items.map((i, index) => {
                                                                    return (<CuisineItem
                                                                        key={i.cartId}
                                                                        index={index + 1}
                                                                        cuisineName={i.cuisineName}
                                                                        quantity={i.quantity}
                                                                        options={i.options}
                                                                    />)
                                                                })}
                                                            </div>
                                                        </div>
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