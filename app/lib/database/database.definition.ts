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

export enum UserCartDbFlag {
    ACTIVE = 1,
    DELETED = 2,
    COOKING = 3,
    DONE = 4
};