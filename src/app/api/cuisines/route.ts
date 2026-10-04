import { fetchAllCusisines } from "@/src/lib/service/cusine.service";
import { NextResponse } from "next/server";

export interface CuisineGetResponse {
    cuisineId: number;
    cuisineName: string;
    cuisineType: string;
}

export async function GET(): Promise<NextResponse<CuisineGetResponse[]>> {
    const result = await fetchAllCusisines();
    return NextResponse.json(result);
}