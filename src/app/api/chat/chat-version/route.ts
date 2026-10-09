import { cookiesSetChatversion, getCookieData } from "@/src/lib/util/cookie-util";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    let cv;
    try {
        const body = await request.json();
        const chatVersion = body.chatVersion;
        if (chatVersion === "v1" || chatVersion === "v2") {
            await cookiesSetChatversion(chatVersion);
            const cookieData = await getCookieData();
            cv = cookieData.chatVersion;
        }
    } catch {
    }
    return NextResponse.json({ chatVersion: cv });
}