import { Suspense } from "react";

import { CheckoutSkeleton } from "@/src/ui/cart/checkout/checkout-skeleton";
import { CheckoutWrapper } from "@/src/ui/cart/checkout/checkout-wrapper";

export default function CartCheckout() {
    return (<>
        <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutWrapper />
        </Suspense>
    </>);
}