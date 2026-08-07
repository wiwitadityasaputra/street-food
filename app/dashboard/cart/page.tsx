import { Suspense } from "react";
import "@/app/dashboard/cart/cart.css";
import { CartWrapper } from "./cart-wrapper";
import { CartSkeleton } from "./cart-skeleton";

export default function Cart() {
    return (<>
        <Suspense fallback={<CartSkeleton />}>
            <CartWrapper/>
        </Suspense>
    </>);
}