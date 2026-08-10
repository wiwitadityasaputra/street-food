import { UserCartResponse } from "@/src/lib/service/service.definition";

export interface CheckoutContentProps {
    userId: string;
    carts: UserCartResponse[];
    emailAddress?: string;
    phoneNumber?: string;
}

export enum CheckoutContentState {
    INIT = 1,
    SUCCESS_CHECKOUT = 2
}
