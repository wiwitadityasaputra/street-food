import { sql } from "@/src/lib/database/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const response = await sql`SELECT 1`;
    const data = {status: "ok", response}
    return NextResponse.json(data);
}