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
    user_order_id: number;
}

export type UserCartDbUserCartId = {
    usercartid: string;
}

export enum UserCartDbFlag {
    ACTIVE = 1,
    DELETED = 2,
    COOKING = 3,
    DONE = 4
};

export enum OrderDbFlag {
    CREATED = 1,
    COOKED = 2,
    SHIPPED = 3,
    RECEIVED = 4,
    CANCELLED = 5
}

export interface MyOrderAndCartDb {
    user_order_id: number;
    flag_order: number;

    created_date: Date;
    cooked_date: Date;
    shipped_date: Date;
    delivered_date: Date;
    cancelled_date: Date;

    first_name: string;
    last_name: string;
    street_address: string;
    second_address: string;
    city: string;
    state: string;
    zip_code: string;
    phone_number: string;
    email_address: string;
    additional_info: string;

    user_cart_id: number;
    user_id: string;
    price_per_item: number;
    quantity: number;
    final_price: number;
    options: string;
    flag_cart: string;
    cuisine_id: string;
    cuisine_name: string;
}

export interface AllOrderAndCartDb {
    user_order_id: number;
    flag_order: number;

    created_date: Date;
    cooked_date: Date;
    shipped_date: Date;
    delivered_date: Date;
    cancelled_date: Date;

    first_name: string;
    last_name: string;
    street_address: string;

    user_cart_id: number;
    options: string;
    cuisine_id: string;
    cuisine_name: string;
    quantity: number;
}

export interface OrderIdUserOrderDb {
    orderid: number;
}

export interface AllUserOrderDb {
    user_order_id: number;
    flag_order: number;

    created_date: Date;
    cooked_date: Date;
    shipped_date: Date;
    delivered_date: Date;
    cancelled_date: Date;

    first_name: string;
    last_name: string;
    street_address: string;
}