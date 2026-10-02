import { cookiesSetChatPanel } from "@/src/lib/util/cookie-util";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const cpo = body.isChatPanelOpen;
        if (cpo === true || cpo === false) {
            await cookiesSetChatPanel(cpo);
        }
    } catch {
    }
    return NextResponse.json({});
}