import { NextResponse } from "next/server";

import { cookiesGetUserId, cookiesSetUserId } from "@/src/lib/util/cookie-util";
import { UserCartResponse } from "@/src/lib/service/service.definition";
import { getUserCarts } from "@/src/lib/service/cart.service";
import { countUserCartByUserAndFlag, fetchCuisinesById, writeToUserCart } from "@/src/lib/database/database";
import { CuisinesDb, UserCartDbFlag } from "@/src/lib/database/database.definition";

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

export interface UserCartRoutePostRequest {
    cuisineId?: number;
    quantity?: number;
}

export async function POST(request: Request): Promise<NextResponse<any>> {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json({});
    }

    const body: UserCartRoutePostRequest = await request.json();
    const cuisineId = body.cuisineId;
    const quantity = body.quantity;

    if (!cuisineId || !quantity) {
        return NextResponse.json({});    
    }

    const cuisineDb: CuisinesDb | undefined = await fetchCuisinesById(String(cuisineId));
    if (!cuisineDb) {
        return NextResponse.json({});    
    }
    const cuisineName = cuisineDb.name;
    const pricePerItem = cuisineDb.price;
    const finalPrice = pricePerItem * quantity;
    const userCartOptions = "";

    await writeToUserCart(String(cuisineId), cuisineName, userId, pricePerItem, quantity, finalPrice, userCartOptions);
    const totalCart = await countUserCartByUserAndFlag(userId, UserCartDbFlag.ACTIVE);
    await cookiesSetUserId(userId);

    return NextResponse.json({});
}