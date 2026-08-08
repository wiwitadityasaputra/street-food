"use server";

import "@/app/ui/cart/cart.css";

export async function CartSkeleton() {
    return (<>
        <div className="cart">please wait,,,</div>
    </>)
}