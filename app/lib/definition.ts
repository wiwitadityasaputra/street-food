export const CART_OPTION_RADIO_PREFIX = "radio-";
export const CART_OPTION_CHECKBOX_PREFIX = "checkbox-";
export const CART_OPTION_VALUE_SEPARATOR = "-";
export const USER_CART_OPTIONS_SEPARATOR = "___";

// Database
export type CuisinesDb = {
    id: number;
    name: string;
    cuisine: string;
    description: string;
    price: number;
    rate: number;
    review: number;
};

export type CuisinesCartDb = {
    id: number;
    cartType: string;
    group: string;
    name: string;
    price: number;
    order: number;
}
export type CuisinesCartDbGroupNamePrice = {
    group: string;
    name: string;
    price: number;
}

export type UserCartDb = {
    cuisine_id: string;
    cuisine_name: string;
    user_cart_id: string;
    price_per_item: number;
    quantity: number;
    final_price: number;
    options: string;
}

export type AddToCartOption = {
    cuisinesCartId: string;
    price: string;
}

export type AddtoCartActionResponse = {
    erroMessage?: string;
    successMessage?: string;
    successObject?: AddtoCartActionSuccessObject;
}

export type AddtoCartActionSuccessObject = {
    userId: string;
    cuisineId: string;
    cuisineName: string;
    pricePerItem: number;
    quantity: number;
    finalPrice: number;
    options: string[];
}

export type UserCartResponse = {
    cuisineId: string;
    cuisineName: string;
    userChartId: string;
    pricePerItem: number;
    quantity: number;
    finalPrice: number;
    options: string[];
}