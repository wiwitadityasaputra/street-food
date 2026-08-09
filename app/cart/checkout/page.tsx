import { CheckoutSkeleton } from "@/app/ui/cart/checkout/checkout-skeleton";
import { CheckoutWrapper } from "@/app/ui/cart/checkout/checkout-wrapper";
import { Suspense } from "react";

export default function CartCheckout() {
    return (<>
        <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutWrapper />
        </Suspense>
    </>);
}