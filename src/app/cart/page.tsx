import { Suspense } from "react";

import { CartSkeleton } from "@/src/ui/cart/cart-skeleton";
import { CartWrapper } from "@/src/ui/cart/cart-wrapper";

export default async function Cart() {
    return (<>
        <Suspense fallback={<CartSkeleton />}>
            <CartWrapper />
        </Suspense>
    </>);
}