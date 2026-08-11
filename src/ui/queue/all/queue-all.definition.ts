import { AllUserOrder } from "@/src/lib/service/service.definition";

export const NUMBER_PER_PAGE = 5;

export interface QueueAllContentProps {
    userTotalOrder: number;
    orders: AllUserOrder[];
    page: number;
    maxPage: number;
}

export interface QueueAllWrapperProps {
    page: number;
}