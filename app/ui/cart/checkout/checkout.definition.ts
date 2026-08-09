import { UserCartResponse } from "@/app/lib/service/service.definition";

export interface CheckoutContentProps {
    userId: string;
    carts: UserCartResponse[];
    firstName?: string;
    lastName?: string;
    streetAddress?: string;
    secondAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneNumber?: string;
    emailAddress?: string;
    additionalInfo?: string;
}

export enum CheckoutContentState {
    INIT = 1,
    SUCCESS_CHECKOUT = 2
}
