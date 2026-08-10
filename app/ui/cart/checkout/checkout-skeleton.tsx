"use server";

import "@/app/ui/cart/checkout/checkout.css"

export async function CheckoutSkeleton() {
    return (<>
        <div className="checkout">
            <section className="cart_view mt_100 xs_mt_70 mb_100 xs_mb_70">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            please wait,,,
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>)
}