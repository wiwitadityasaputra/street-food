export type Cuisines = {
    id: number;
    name: string;
    cuisine: string;
    description: string;
    price: number;
    rate: number;
    review: number;
};

export type CuisinesChart = {
    id: number;
    cartType: string;
    group: string;
    name: string;
    price: number;
    order: number;
}