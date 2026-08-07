"use server";

import "@/app/dashboard/cart/cart.css";

export async function CartSkeleton() {
    return (<>
        <div className="cart">please wait,,,</div>
    </>)
}