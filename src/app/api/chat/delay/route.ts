import { cookiesSetChatDelay } from "@/src/lib/util/cookie-util";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    if (
        typeof body !== "object" ||
        body === null ||
        !("delay" in body) ||
        typeof body.delay !== "boolean"
    ) {
        return NextResponse.json({ error: "delay must be a boolean" }, { status: 400 });
    }

    await cookiesSetChatDelay(body.delay);
    return NextResponse.json({ delay: body.delay });
}
