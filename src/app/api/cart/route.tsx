import { NextResponse } from "next/server";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { UserCartResponse } from "@/src/lib/service/service.definition";
import { getUserCarts } from "@/src/lib/service/cart.service";

export interface UserCartRouteGetResponse {
    userCartId: string;
    foodName: string;
}

export async function GET(): Promise<NextResponse<UserCartRouteGetResponse[]>> {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json([]);
    }
    const carts: UserCartResponse[] = await getUserCarts(userId);
    const result: UserCartRouteGetResponse[] = [];
    carts.forEach(c => {
        result.push({
            userCartId: c.userCartId,
            foodName: c.cuisineName
        })
    })
    return NextResponse.json(result);
}