"use server";

import { redirect } from 'next/navigation';

import { getUserCarts } from "@/app/lib/service/cart.service";
import { UserCartResponse } from "@/app/lib/service/service.definition";
import { cookiesGetUserId } from "@/app/lib/util/cookie-util";
import CheckoutContent from "./checkout-content";

export async function CheckoutWrapper() {
    
    const userId = await cookiesGetUserId();
    if (userId) {
        const carts: UserCartResponse[] = await getUserCarts(userId);
        if (!carts || carts.length === 0) {
            redirect(`/menu`);
        } else {
            return (<>
                <CheckoutContent carts={carts} />
            </>)
        }
    } else {
        redirect(`/menu`);
    }
}