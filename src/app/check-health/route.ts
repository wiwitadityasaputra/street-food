import { pingDatabase } from "@/src/lib/database/database";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    const response = await pingDatabase();
    const data = { status: "ok", response }
    return NextResponse.json(data);
}