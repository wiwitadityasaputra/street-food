import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const env = process.env.POSTGRES_URL;
    const data = {status: "ok", env}
    return NextResponse.json(data);
}