import { AllUserOrder } from "@/src/lib/service/service.definition";

export const NUMBER_PER_PAGE = 5;

export interface QueueAllContentProps {
    orders: AllUserOrder[];
}

export interface QueueAllWrapperProps {
    page: number;
    size: number;
}