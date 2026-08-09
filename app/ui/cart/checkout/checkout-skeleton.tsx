"use server";

import "@/app/ui/cart/cart.css";

export async function CheckoutSkeleton() {
    return (<>
        <div className="cart">please wait,,,</div>
    </>)
}