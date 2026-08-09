export const DEFAULT_SUCCESS_MESSAGE = "ok";

// Menu Form Action
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


// Cart Form Action
export type ProcessCartActionResponse = {
    erroMessage?: string;
    successMessage?: string;
}