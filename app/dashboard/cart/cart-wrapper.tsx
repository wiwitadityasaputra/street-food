"use server";

import "@/app/dashboard/cart/cart.css";
import { CartContent } from "./cart-content";

export async function CartWrapper() {
    
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 1000)
    });

    return (<>
        <CartContent data="cart-conent" />
    </>)
}