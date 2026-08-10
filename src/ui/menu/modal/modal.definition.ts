import { CuisinesCartDb, CuisinesDb } from "@/src/lib/database/database.definition";

export interface CuisinesContentOptions {
    cuisine: CuisinesDb;
    cuisineCarts: CuisinesCartDb[];
    userId: string;
}

export interface CuisinesOptionsDetail {
    id: number;
    name: string;
    price: number;
    checked: boolean;
}

export interface CuisinesOptions {
    name: string;
    mandatory: boolean;
    detail: CuisinesOptionsDetail[];
    latestPriceIncrease: number;
}

export interface CheckboxOptionsState {
    name: string;
    price: number;
}

export interface ModalSkeletonProps {
    cuisine: string;
}

export interface ModalWrapperOptions {
    cuisineId: string;
    cuisine: string;
}