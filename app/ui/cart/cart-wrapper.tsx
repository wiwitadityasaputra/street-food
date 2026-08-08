"use server";

import "@/app/ui/cart/cart.css";
import { CartContent } from "./cart-content";
import { getUserCarts } from '@/app/lib/service/cart.service';
import { UserCartResponse } from '@/app/lib/service/service.definition';
import { cookiesGetUserId } from '@/app/lib/util/cookie-util';

export async function CartWrapper() {
    
    const userId = await cookiesGetUserId();
    if (userId) {
        const carts: UserCartResponse[] = await getUserCarts(userId);
        return (<>
            <CartContent carts={carts} />
        </>)
    } else {
        return (<>
            <div className="cart">no data</div>;
        </>);
    }
}