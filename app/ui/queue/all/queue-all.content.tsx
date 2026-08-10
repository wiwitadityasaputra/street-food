import { QueueMenu } from "@/app/ui/queue/queue-menu/queue-menu";
import { QueueAllContentProps } from "@/app/ui/queue/all/queue-all.definition";

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
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th className="pro_name">Address</th>
                                                <th className="pro_name col-cart-item">Items</th>
                                                <th className="pro_img">Status</th>
                                                <th className="pro_img col-cart-date">Date</th>
                                            </tr>
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