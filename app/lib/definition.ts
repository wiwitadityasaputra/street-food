export type Cuisines = {
    id: number;
    name: string;
    cuisine: string;
    description: string;
    price: number;
    rate: number;
    review: number;
};

export type CuisinesCart = {
    id: number;
    cartType: string;
    group: string;
    name: string;
    price: number;
    order: number;
}

export const CART_OPTION_RADIO_PREFIX = "radio-";
export const CART_OPTION_CHECKBOX_PREFIX = "checkbox-";
export const CART_OPTION_VALUE_SEPARATOR = "-";

export type AddToCartOption = {
    cuisinesCartId: string;
    price: string;
}

export type CuisineCartPrice = {
    group: string;
    name: string;
    price: number;
}

export type AddtoCartActionResponse = {
    erroMessage?: string;
    successMessage?: string;
    successObject?: AddtoCartActionSuccessObject;
}

export type AddtoCartActionSuccessObject = {
    cuisineId: string;
    cuisineName: string;
    pricePerItem: number;
    quantity: number;
    finalPrice: number;
    options: string[];
}