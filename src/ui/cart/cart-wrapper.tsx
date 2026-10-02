"use server";

import "@/src/ui/cart/cart.css";
import { CartContent } from "@/src/ui/cart/cart-content";
import { getUserCarts } from '@/src/lib/service/cart.service';
import { UserCartResponse } from '@/src/lib/service/service.definition';
import { cookiesGetUserId } from '@/src/lib/util/cookie-util';
import { CartWrapperProps } from "@/src/ui/cart/cart-content.definition";

export async function CartWrapper(props: CartWrapperProps) {
    const userId = await cookiesGetUserId();
    if (userId) {
        const carts: UserCartResponse[] = await getUserCarts(userId);
        return (<>
            <CartContent carts={carts} userId={userId} messages={props.messages} />
        </>);
    } else {
        return (<>
            <div className="cart">no data</div>;
        </>);
    }
}