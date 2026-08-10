"use server";

import "@/src/ui/cart/cart.css";

export async function CartSkeleton() {
    return (<>
        <div className="cart">
            <section className="cart_view mt_100 xs_mt_70 mb_100 xs_mb_70">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 wow fadeInUp">
                            please wait,,,
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>)
}