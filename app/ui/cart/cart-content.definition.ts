import { UserCartResponse } from "@/app/lib/service/service.definition";

export interface CartContentProps {
    carts: UserCartResponse[];
    userId: string;
}