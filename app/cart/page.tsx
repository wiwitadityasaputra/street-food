import { Suspense } from "react";

import { CartSkeleton } from "@/app/ui/cart/cart-skeleton";
import { CartWrapper } from "@/app/ui/cart/cart-wrapper";

export default function Cart() {
    return (<>
        <Suspense fallback={<CartSkeleton />}>
            <CartWrapper/>
        </Suspense>
    </>);
}