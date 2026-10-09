import { NextResponse } from "next/server";

import { cookiesGetUserId, cookiesSetUserId } from "@/src/lib/util/cookie-util";
import { USER_CART_OPTIONS_SEPARATOR, UserCartResponse } from "@/src/lib/service/service.definition";
import { getUserCarts } from "@/src/lib/service/cart.service";
import { countUserCartByUserAndFlag, fetchCuisineCartPrices, fetchCuisinesById, writeToUserCart } from "@/src/lib/database/database";
import { CuisinesCartDbGroupNamePrice, CuisinesDb, UserCartDbFlag } from "@/src/lib/database/database.definition";

export interface UserCartRouteGetResponse {
    cuisineName: string;
    userCartId: number;
    quantity: number;
    finalPrice: number;
    options?: string[];
}

export async function GET(): Promise<NextResponse<UserCartRouteGetResponse[]>> {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json([], { status: 401 });
    }
    const carts: UserCartResponse[] = await getUserCarts(userId);
    const result: UserCartRouteGetResponse[] = [];
    carts.forEach((c, index) => {
        const data: UserCartRouteGetResponse = {
            cuisineName: c.cuisineName,
            userCartId: c.userCartId,
            quantity: c.quantity,
            finalPrice: c.finalPrice
        };
        if (c.options) {
            data.options = c.options;
        }
        result.push(data);
    });
    return NextResponse.json(result, {status: 200});
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
        return NextResponse.json({}, { status: 401 });
    }

    const body: UserCartRoutePostRequest = await request.json();
    const cuisineId = body.cuisineId;
    const quantity = body.quantity;

    if (!cuisineId || !quantity) {
        return NextResponse.json({}, { status: 400 });
    }

    const cuisineDb: CuisinesDb | undefined = await fetchCuisinesById(String(cuisineId));
    if (!cuisineDb) {
        return NextResponse.json({}, { status: 400 });
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

    return NextResponse.json({ totalCart }, { status: 200});
}