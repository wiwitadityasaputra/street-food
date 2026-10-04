import { CuisineGetResponse } from "@/src/app/api/cuisines/route";
import { fetchCuisinesByCuisine } from "@/src/lib/database/database"

export async function fetchAllCusisines(): Promise<CuisineGetResponse[]> {
    const result: CuisineGetResponse[] = [];
    const dbResults = await fetchCuisinesByCuisine(undefined);
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
