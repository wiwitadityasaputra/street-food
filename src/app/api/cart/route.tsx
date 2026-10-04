import { NextResponse } from "next/server";

import { cookiesGetUserId, cookiesSetUserId } from "@/src/lib/util/cookie-util";
import { USER_CART_OPTIONS_SEPARATOR, UserCartResponse } from "@/src/lib/service/service.definition";
import { getUserCarts } from "@/src/lib/service/cart.service";
import { countUserCartByUserAndFlag, fetchCuisineCartPrices, fetchCuisinesById, writeToUserCart } from "@/src/lib/database/database";
import { CuisinesCartDbGroupNamePrice, CuisinesDb, UserCartDbFlag } from "@/src/lib/database/database.definition";

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
    addOnsIds?: number[];
}

export interface UserCartRoutePostResponse {
    totalCart?: number;
}

export async function POST(request: Request): Promise<NextResponse<UserCartRoutePostResponse>> {
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
    let userCartOptions = "";

    const addOnsIds = body.addOnsIds;
    if (addOnsIds && addOnsIds.length) {
        let sqlString = 'SELECT "group", name, price FROM cuisine_cart WHERE ';
        addOnsIds.forEach((o, index) => {
            if (index > 0) {
                sqlString += " OR";
            }
            sqlString += " (id=" + o + " and cuisine_id=" + cuisineId + ")";
        });

        // validation, db check cuisine_cart, cart options lenght should match with db results
        const cuisinesCart: CuisinesCartDbGroupNamePrice[] = await fetchCuisineCartPrices(sqlString);
        if (cuisinesCart.length != addOnsIds.length) {
            return NextResponse.json({}, { status: 400 });
        }

        cuisinesCart.forEach((c, index) => {
            const option = c.group + ": " + c.name;
            if (index > 0) {
                userCartOptions += USER_CART_OPTIONS_SEPARATOR;
            }
            userCartOptions += option;
        });
    }

    await writeToUserCart(String(cuisineId), cuisineName, userId, pricePerItem, quantity, finalPrice, userCartOptions);
    const totalCart = await countUserCartByUserAndFlag(userId, UserCartDbFlag.ACTIVE);
    await cookiesSetUserId(userId);

    return NextResponse.json({ totalCart });
}