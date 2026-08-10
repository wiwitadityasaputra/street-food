import { Suspense } from "react";

import { CartSkeleton } from "@/src/ui/cart/cart-skeleton";
import { CartWrapper } from "@/src/ui/cart/cart-wrapper";

export default function Cart() {
    return (<>
        <Suspense fallback={<CartSkeleton />}>
            <CartWrapper/>
        </Suspense>
    </>);
}