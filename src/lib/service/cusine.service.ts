import { CuisineDetailGetResponse } from "@/src/app/api/cuisines/[id]/route";
import { CuisineGetResponse } from "@/src/app/api/cuisines/route";
import {
    fetchCuisinesByCuisine,
    fetchCuisineCartByCuisineId
} from "@/src/lib/database/database"
import { CuisinesCartDb, CuisinesDb } from "@/src/lib/database/database.definition";

export async function fetchAllCusisines(): Promise<CuisineGetResponse[]> {
    const result: CuisineGetResponse[] = [];
    const dbResults: CuisinesDb[] = await fetchCuisinesByCuisine(undefined);
    if (dbResults && dbResults.length) {
        dbResults.forEach(r => {
            result.push({
                cuisineId: r.id,
                cuisineName: r.name,
                cuisineType: r.cuisine
            })
        })
    }
    return result;
}

export async function fetchCuisinesById(cuisineId: string): Promise<CuisineDetailGetResponse> {
    const dbResults: CuisinesCartDb[] = await fetchCuisineCartByCuisineId(cuisineId);
    const result: CuisineDetailGetResponse = {
        cuisineId: Number(cuisineId),
        addOns: []
    };
    if (dbResults && dbResults.length > 0) {
        dbResults.forEach(d => {
            if (d.cartType === "checkbox") {
                result.addOns.push({
                    addonId: d.id,
                    addonName: d.name
                })
            }
        });
    }
    return result;
}