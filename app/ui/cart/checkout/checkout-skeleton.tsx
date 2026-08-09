"use server";

import "@/app/ui/cart/checkout/checkout.css"

export async function CheckoutSkeleton() {
    return (<>
        <div className="checkout">please wait,,,</div>
    </>)
}