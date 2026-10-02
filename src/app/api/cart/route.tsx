import { NextResponse } from "next/server";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { UserCartResponse } from "@/src/lib/service/service.definition";
import { getUserCarts } from "@/src/lib/service/cart.service";

export async function GET(): Promise<NextResponse<UserCartResponse[]>> {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json([]);
    }
    const carts: UserCartResponse[] = await getUserCarts(userId);
    return NextResponse.json(carts);
}