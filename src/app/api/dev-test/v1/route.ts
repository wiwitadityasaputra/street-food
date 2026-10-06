import { NextResponse } from "next/server";


export async function GET(): Promise<NextResponse> {
    if (process.env.PROFILE !== "DEV") { return new NextResponse(null, { status: 403});}

    return new NextResponse(null, { status: 200});
}