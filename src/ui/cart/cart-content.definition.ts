import { UserCartResponse } from "@/src/lib/service/service.definition";

export interface CartContentProps {
    carts: UserCartResponse[];
    userId: string;
}