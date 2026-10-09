import { NextResponse } from "next/server";
import { ModelMessage } from "ai";

import { cookiesGetUserId } from "@/src/lib/util/cookie-util";
import { ChatRequestStatus, ChatStreamResponse } from "@/src/lib/route/chat/v1/chat.definition";
import { welcomeResponse } from "@/src/lib/route/chat/v1/responses";
import { writeToUserChatMain } from "@/src/lib/database/database";
import { CustomerServiceAgent } from "@/src/lib/route/chat/v2/customerservice-agent/cs-agent";

export async function POST(request: Request) {
    const userId = await cookiesGetUserId();
    if (!userId) {
        return NextResponse.json({}, { status: 401 });
    }

    const { message } = await request.json();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: ChatStreamResponse) => {
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                );
            };

            await writeToUserChatMain(userId, "user", "standard", message);

            // message too long
            if (!message || message.length > 200) {
                const responseMsg = welcomeResponse();
                await writeToUserChatMain(userId, "standard", "assistant", responseMsg);

                send({
                    status: ChatRequestStatus.DONE,
                    replies: [responseMsg]
                });
            }

            const modelMessage: ModelMessage = { content: message, role: "user" };
            const csAgentInput: ModelMessage[] = [modelMessage];
            const aiInput = JSON.stringify({ csAgentInput });
            console.log("POST /api/chat/v1 - aiInput ", aiInput);

            await CustomerServiceAgent(userId, csAgentInput, [], send);
            controller.close();
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
        },
    });
}