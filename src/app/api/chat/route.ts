import { NextResponse } from "next/server";

const DUMMY_REPLY = "Thanks for your message! Our team will be happy to help.";

export async function POST(request: Request) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return NextResponse.json({ reply: DUMMY_REPLY });
}
