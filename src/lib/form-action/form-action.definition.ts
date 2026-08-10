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
    totalCart: number;
}

// Cart Form Action
export type DeleteCartActionSuccessObject = {
    totalCart: number;
}

export type DeleteCartActionResponse = {
    erroMessage?: string;
    successMessage?: string;
    successObject?: DeleteCartActionSuccessObject;
}

export type ProcessCartActionResponse = {
    erroMessage?: string;
    successMessage?: string;
}