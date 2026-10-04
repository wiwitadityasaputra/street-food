import { fetchCuisinesById } from "@/src/lib/service/cusine.service";
import { NextResponse } from "next/server";

export interface CuisineDetailAddOns {
    addonId: number;
    addonName: string;
}

export interface CuisineDetailGetResponse {
    cuisineId: number;
    addOns: CuisineDetailAddOns[];
}

interface RouteParams {
  params: Promise<{ id: string }>;
}
export async function GET(request: Request, { params }: RouteParams): Promise<NextResponse<CuisineDetailGetResponse>> {
    const { id } = await params;
    const result: CuisineDetailGetResponse = await fetchCuisinesById(id);
    return NextResponse.json(result);
}