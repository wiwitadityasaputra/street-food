'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
    CART_OPTION_CHECKBOX_PREFIX,
    CART_OPTION_RADIO_PREFIX,
    CART_OPTION_VALUE_SEPARATOR,
    AddToCartOption, 
    CuisineCartPrice,
    AddtoCartActionResponse,
    AddtoCartActionSuccessObject
} from './definition';
import { fetchCuisineCartPrices, fetchCuisinesById } from './data';

export async function addToCart(prevState: any, formData: FormData): Promise<AddtoCartActionResponse> {
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
    const cuisinesCart: CuisineCartPrice[] = await fetchCuisineCartPrices(sqlString);
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
        cuisineId: cuisineId,
        cuisineName: cuisine.name,
        pricePerItem: pricePerItem,
        quantity: quantity,
        finalPrice: finalPrice,
        options: []
    };
    cuisinesCart.forEach(c => {
        response.options.push(c.group + ": " + c.name);
    });

    return {
        successMessage: "OK",
        successObject: response
    };
}

export async function closeAddToCartModal() {
    redirect('/dashboard/menu');
}