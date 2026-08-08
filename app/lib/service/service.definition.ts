export const CART_OPTION_RADIO_PREFIX = "radio-";
export const CART_OPTION_CHECKBOX_PREFIX = "checkbox-";
export const CART_OPTION_VALUE_SEPARATOR = "-";
export const USER_CART_OPTIONS_SEPARATOR = "___";

// Service
export type UserCartResponse = {
    cuisineId: string;
    cuisineName: string;
    userCartId: string;
    pricePerItem: number;
    quantity: number;
    finalPrice: number;
    options: string[];
}
