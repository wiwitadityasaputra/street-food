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

export type UserOrderItem = {
    cartId: number;
    
    cuisineId: string;
    cuisineName: string;
    options: string[];

    pricePerItem: number;
    quantity: number;
    finalPrice: number;
}

export type UserOrder = {
    orderId: number;
    flagOrder: number;

    createdDate: Date;
    cookedDate: Date;
    shippedDate: Date;
    deliveredDate: Date;
    cancelledDate: Date;

    firstName: string;
    lastName: string;
    streetAddress: string;
    secondAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    emailAddress: string;
    additionalInfo: string;

    items: UserOrderItem[];
}