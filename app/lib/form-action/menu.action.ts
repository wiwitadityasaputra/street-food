"use server";

import { redirect } from 'next/navigation';
import {
    CART_OPTION_CHECKBOX_PREFIX,
    CART_OPTION_RADIO_PREFIX,
    CART_OPTION_VALUE_SEPARATOR,
    USER_CART_OPTIONS_SEPARATOR
} from '@/app/lib/service/service.definition';
import {
    cookiesSetUserIdAndTotalCart
} from '@/app/lib/util/cookie-util';
import {
    AddtoCartActionResponse,
    AddtoCartActionSuccessObject,
    AddToCartOption
} from '@/app/lib/form-action/form-action.definition';
import {
    CuisinesCartDbGroupNamePrice,
    UserCartDbFlag
} from '@/app/lib/database/database.definition';
import {
    countUserCartByUserAndFlag,
    fetchCuisineCartPrices,
    fetchCuisinesById,
    writeToUserCart
} from '@/app/lib/database/database';

export async function addToCart(prevState: any, formData: FormData): Promise<AddtoCartActionResponse> {
    const userId = String(formData.get("userId"));
    const cuisineName = String(formData.get("cuisineName"));
    const finalPrice = Number(formData.get("finalPrice"));
    const quantity = Number(formData.get("quantity"));
    const pricePerItem = Number(formData.get("pricePerItem"));
    const cuisineId = String(formData.get("cuisineId"));
    if (!cuisineId) {
        return { erroMessage: "Can't find cuisine by id=" + cuisineId };
    }
    if (!pricePerItem) {
        return { erroMessage: "Can't find pricePerItem value"};
    }

    const options: AddToCartOption[] = [];
    formData.forEach((value: FormDataEntryValue, cuisinesCartId: string) => {
        if (cuisinesCartId.indexOf(CART_OPTION_CHECKBOX_PREFIX) >= 0 ||
            cuisinesCartId.indexOf(CART_OPTION_RADIO_PREFIX) >= 0) {

            const splits = String(value).split(CART_OPTION_VALUE_SEPARATOR);
            options.push({
                cuisinesCartId: splits[0],
                price: splits[1]
            });
        }
    })

    let sqlString = 'SELECT "group", name, price FROM cuisine_cart WHERE ';
    options.forEach((o, index) => {
        if (index > 0) {
            sqlString += " OR";
        }
        sqlString += " (id=" + o.cuisinesCartId + " and cuisine_id=" + cuisineId + " and price=" + o.price + ")";
    });

    // validation, db check cuisine_cart, cart options lenght should match with db results
    const cuisinesCart: CuisinesCartDbGroupNamePrice[] = await fetchCuisineCartPrices(sqlString);
    if (cuisinesCart.length != options.length) {
        return { erroMessage: "Cuisine options is not match with database" };
    }

    // validation, db get cuisine price, check price per item
    const cuisine = await fetchCuisinesById(cuisineId);
    if (!cuisine) {
        return { erroMessage: "Can't find cuisine by id=" + cuisineId };
    }
    let pricePerItemDb = cuisine.price;
    cuisinesCart.forEach(p => {
        pricePerItemDb += p.price;
    });

    if (pricePerItem !== pricePerItemDb) {
        return { erroMessage: "Price per item is not match with database."};
    }

    // validation, check price per item, quantity, final price
    const finalPriceDb = quantity * pricePerItemDb;
    if (finalPrice !== finalPriceDb) {
        return { erroMessage: "Final price is not match with database."};
    }

    const response: AddtoCartActionSuccessObject = {
        userId: userId,
        cuisineId: cuisineId,
        cuisineName: cuisine.name,
        pricePerItem: pricePerItem,
        quantity: quantity,
        finalPrice: finalPrice,
        options: []
    };

    let userCartOptions = "";
    cuisinesCart.forEach((c, index) => {
        const option = c.group + ": " + c.name;
        response.options.push(option);

        if (index > 0) {
            userCartOptions += USER_CART_OPTIONS_SEPARATOR;
        }
        userCartOptions += option;
    });

    await writeToUserCart(cuisineId, cuisineName, userId, pricePerItem, quantity, finalPrice, userCartOptions);
    const totalCart = await countUserCartByUserAndFlag(userId, UserCartDbFlag.ACTIVE);
    await cookiesSetUserIdAndTotalCart(userId, totalCart);

    return {
        successMessage: "OK",
        successObject: response
    };
}

export async function closeAddToCartModal(cuisine: string) {
    redirect(`/menu?cuisine=${cuisine}`);
}