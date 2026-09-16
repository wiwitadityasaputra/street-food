import { sql } from "@/src/lib/database/database";
import { NextRequest, NextResponse } from "next/server";
const randomNumber = Math.floor(Math.random() * 101);

export async function GET(request: NextRequest) {
    const response = await sql`SELECT 1`;
    const data = {status: "ok", response, version: "047", randomNumber};
    return NextResponse.json(data);
}