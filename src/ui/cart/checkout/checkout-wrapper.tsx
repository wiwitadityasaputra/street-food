"use server";

import { redirect } from 'next/navigation';

import { getUserCarts } from "@/src/lib/service/cart.service";
import { UserCartResponse } from "@/src/lib/service/service.definition";
import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import CheckoutContent from "@/src/ui/cart/checkout/checkout-content";
import { getRandomEmail, getRandomPhonenumber } from '@/src/lib/util/fake-input.util';

export async function CheckoutWrapper() {

    const userId = await cookiesGetUserId();
    if (userId) {

        const carts: UserCartResponse[] = await getUserCarts(userId);
        if (!carts || carts.length === 0) {
            redirect(`/menu`);
        } else {

            return (<>
                <CheckoutContent
                    userId={userId}
                    carts={carts}
                    emailAddress={getRandomEmail()}
                    phoneNumber={getRandomPhonenumber()}
                />
            </>)
        }
    } else {
        redirect(`/menu`);
    }
}